import mongoose from 'mongoose';
import { DatabaseAdapter } from './DatabaseAdapter.js';
import chalk from 'chalk';

// Define schemas
const dataSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const DataModel = mongoose.model('Data', dataSchema);

export class MongoDBAdapter implements DatabaseAdapter {
  private connected: boolean = false;

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
      return true;
    } catch (error) {
      console.error(chalk.red('Failed to connect to MongoDB:'), error);
      this.connected = false;
      return false;
    }
  }

  isConnected(): boolean {
    return this.connected && mongoose.connection.readyState === 1;
  }

  async get(path: string): Promise<any> {
    try {
      const doc = await DataModel.findOne({ path });
      return doc ? doc.value : null;
    } catch (error) {
      console.error(chalk.red(`MongoDB get error for path ${path}:`), error);
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
    } catch (error) {
      console.error(chalk.red(`MongoDB set error for path ${path}:`), error);
      throw error;
    }
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
      return {};
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.connected = false;
  }
}
