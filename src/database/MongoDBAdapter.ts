import mongoose from 'mongoose';
import { DatabaseAdapter } from './DatabaseAdapter.js';
import { JsonAdapter } from './JsonAdapter.js';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

// Define schemas
const dataSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const DataModel = mongoose.model('Data', dataSchema);

export class MongoDBAdapter implements DatabaseAdapter {
  private connected: boolean = false;
  private jsonBackup: JsonAdapter | null = null;
  private backupInterval: NodeJS.Timeout | null = null;
  private lastBackupTime: number = 0;
  private readonly BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  async connect(uri: string): Promise<boolean> {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      mongoose.connection.on('connected', () => {
        console.log(chalk.green('✓ MongoDB connected successfully'));
        this.connected = true;
      });

      mongoose.connection.on('error', (err) => {
        console.error(chalk.red('MongoDB error:'), err);
        this.connected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log(chalk.yellow('⚠ MongoDB disconnected'));
        this.connected = false;
      });

      this.connected = true;

      // Initialize JSON backup
      await this.initializeBackup();

      // Start automatic backup
      this.startAutoBackup();

      return true;
    } catch (error) {
      console.error(chalk.red('Failed to connect to MongoDB:'), error);
      this.connected = false;
      return false;
    }
  }

  private async initializeBackup(): Promise<void> {
    try {
      this.jsonBackup = new JsonAdapter();
      await this.jsonBackup.init();
      console.log(chalk.blue('✓ JSON backup system initialized'));

      // Perform initial backup
      await this.backupToJson();
    } catch (error) {
      console.error(chalk.red('Failed to initialize backup:'), error);
    }
  }

  private startAutoBackup(): void {
    // Backup every 5 minutes
    this.backupInterval = setInterval(async () => {
      await this.backupToJson();
    }, this.BACKUP_INTERVAL);

    console.log(chalk.blue('✓ Auto-backup enabled (every 5 minutes)'));
  }

  private async backupToJson(): Promise<void> {
    if (!this.jsonBackup || !this.isConnected()) return;

    try {
      const now = Date.now();
      
      // Don't backup too frequently
      if (now - this.lastBackupTime < 60000) return; // Min 1 minute between backups

      console.log(chalk.cyan('📦 Starting MongoDB → JSON backup...'));

      // Get all data from MongoDB
      const allData = await this.all();

      // Reconstruct nested structure
      const reconstructed: any = {};
      
      for (const [path, value] of Object.entries(allData)) {
        const parts = path.split('.');
        let current = reconstructed;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }

        current[parts[parts.length - 1]] = value;
      }

      // Save to JSON backup
      const backupPath = path.join(process.cwd(), 'database', 'json', 'data.json');
      await fs.writeFile(backupPath, JSON.stringify(reconstructed, null, 2), 'utf-8');

      this.lastBackupTime = now;
      console.log(chalk.green('✓ Backup completed successfully'));
    } catch (error) {
      console.error(chalk.red('Backup failed:'), error);
    }
  }

  isConnected(): boolean {
    return this.connected && mongoose.connection.readyState === 1;
  }

  async get(path: string): Promise<any> {
    try {
      const doc = await DataModel.findOne({ path });
      
      // If not found in MongoDB, try JSON backup
      if (!doc && this.jsonBackup) {
        const jsonValue = await this.jsonBackup.get(path);
        if (jsonValue !== null && jsonValue !== undefined) {
          console.log(chalk.cyan(`📋 Reading from JSON backup: ${path}`));
          return jsonValue;
        }
      }
      
      return doc ? doc.value : null;
    } catch (error) {
      console.error(chalk.red(`MongoDB get error for path ${path}:`), error);
      
      // Fallback to JSON if MongoDB fails
      if (this.jsonBackup) {
        console.log(chalk.yellow(`⚠ Falling back to JSON for: ${path}`));
        return await this.jsonBackup.get(path);
      }
      
      throw error;
    }
  }

  async set(path: string, value: any): Promise<void> {
    try {
      await DataModel.findOneAndUpdate(
        { path },
        { value, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      // Also save to JSON backup immediately for critical data
      if (this.jsonBackup && this.isCriticalPath(path)) {
        await this.jsonBackup.set(path, value);
      }
    } catch (error) {
      console.error(chalk.red(`MongoDB set error for path ${path}:`), error);
      
      // Fallback to JSON if MongoDB fails
      if (this.jsonBackup) {
        console.log(chalk.yellow(`⚠ Falling back to JSON for: ${path}`));
        await this.jsonBackup.set(path, value);
      } else {
        throw error;
      }
    }
  }

  private isCriticalPath(path: string): boolean {
    // Critical paths that should be backed up immediately
    return path.startsWith('levels.') || 
           path.startsWith('users.') || 
           path.startsWith('rankConfig.');
  }

  async push(path: string, value: any): Promise<void> {
    try {
      const current = await this.get(path);
      const array = Array.isArray(current) ? current : [];
      array.push(value);
      await this.set(path, array);
    } catch (error) {
      console.error(chalk.red(`MongoDB push error for path ${path}:`), error);
      throw error;
    }
  }

  async delete(path: string): Promise<void> {
    try {
      await DataModel.deleteOne({ path });

      // Also delete from JSON backup
      if (this.jsonBackup) {
        await this.jsonBackup.delete(path);
      }
    } catch (error) {
      console.error(chalk.red(`MongoDB delete error for path ${path}:`), error);
      throw error;
    }
  }

  async has(path: string): Promise<boolean> {
    try {
      const doc = await DataModel.findOne({ path });
      return doc !== null;
    } catch (error) {
      console.error(chalk.red(`MongoDB has error for path ${path}:`), error);
      
      // Fallback to JSON
      if (this.jsonBackup) {
        return await this.jsonBackup.has(path);
      }
      
      return false;
    }
  }

  async all(): Promise<any> {
    try {
      const docs = await DataModel.find({});
      const result: any = {};
      docs.forEach(doc => {
        result[doc.path] = doc.value;
      });
      return result;
    } catch (error) {
      console.error(chalk.red('MongoDB all error:'), error);
      
      // Fallback to JSON
      if (this.jsonBackup) {
        console.log(chalk.yellow('⚠ Falling back to JSON for all()'));
        return await this.jsonBackup.all();
      }
      
      return {};
    }
  }

  async disconnect(): Promise<void> {
    // Stop auto-backup
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }

    // Final backup before disconnect
    await this.backupToJson();

    await mongoose.disconnect();
    this.connected = false;
    console.log(chalk.blue('✓ MongoDB disconnected, final backup completed'));
  }

  // Manual backup trigger
  async forceBackup(): Promise<void> {
    await this.backupToJson();
  }
}
