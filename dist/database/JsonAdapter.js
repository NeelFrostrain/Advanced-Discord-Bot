import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class JsonAdapter {
    dataDir;
    dataFile;
    data = {};
    locks = new Map();
    saveTimeout = null;
    constructor() {
        this.dataDir = join(__dirname, '../../database/json');
        this.dataFile = join(this.dataDir, 'data.json');
    }
    async init() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            try {
                const content = await fs.readFile(this.dataFile, 'utf-8');
                this.data = JSON.parse(content);
                console.log(chalk.green('✓ JSON database loaded'));
            }
            catch (error) {
                // File doesn't exist, create it
                this.data = {};
                await this.save();
                console.log(chalk.green('✓ JSON database initialized'));
            }
        }
        catch (error) {
            console.error(chalk.red('Failed to initialize JSON database:'), error);
            throw error;
        }
    }
    async acquireLock(key) {
        while (this.locks.has(key)) {
            await this.locks.get(key);
        }
        let releaseLock;
        const lockPromise = new Promise((resolve) => {
            releaseLock = resolve;
        });
        this.locks.set(key, lockPromise);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 0);
        });
    }
    releaseLock(key) {
        this.locks.delete(key);
    }
    getNestedValue(obj, path) {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current === null || current === undefined) {
                return null;
            }
            current = current[key];
        }
        return current;
    }
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        for (const key of keys) {
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        current[lastKey] = value;
    }
    deleteNestedValue(obj, path) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        for (const key of keys) {
            if (!(key in current)) {
                return;
            }
            current = current[key];
        }
        delete current[lastKey];
    }
    async save() {
        try {
            await fs.writeFile(this.dataFile, JSON.stringify(this.data, null, 2), 'utf-8');
        }
        catch (error) {
            console.error(chalk.red('Failed to save JSON database:'), error);
            throw error;
        }
    }
    scheduleSave() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
            this.save().catch(console.error);
        }, 1000);
    }
    async get(path) {
        await this.acquireLock(path);
        try {
            return this.getNestedValue(this.data, path);
        }
        finally {
            this.releaseLock(path);
        }
    }
    async set(path, value) {
        await this.acquireLock(path);
        try {
            this.setNestedValue(this.data, path, value);
            this.scheduleSave();
        }
        finally {
            this.releaseLock(path);
        }
    }
    async push(path, value) {
        await this.acquireLock(path);
        try {
            const current = this.getNestedValue(this.data, path);
            const array = Array.isArray(current) ? current : [];
            array.push(value);
            this.setNestedValue(this.data, path, array);
            this.scheduleSave();
        }
        finally {
            this.releaseLock(path);
        }
    }
    async delete(path) {
        await this.acquireLock(path);
        try {
            this.deleteNestedValue(this.data, path);
            this.scheduleSave();
        }
        finally {
            this.releaseLock(path);
        }
    }
    async has(path) {
        await this.acquireLock(path);
        try {
            return this.getNestedValue(this.data, path) !== null && this.getNestedValue(this.data, path) !== undefined;
        }
        finally {
            this.releaseLock(path);
        }
    }
    async all() {
        return { ...this.data };
    }
    async backup() {
        const backupDir = join(this.dataDir, '../backups');
        await fs.mkdir(backupDir, { recursive: true });
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const backupFile = join(backupDir, `backup-${timestamp}.json`);
        await fs.writeFile(backupFile, JSON.stringify(this.data, null, 2), 'utf-8');
        console.log(chalk.green(`✓ Backup created: ${backupFile}`));
        return backupFile;
    }
}
