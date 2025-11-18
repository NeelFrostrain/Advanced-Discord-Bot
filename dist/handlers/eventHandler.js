import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default async (client) => {
    const eventsPath = join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of eventFiles) {
        try {
            const event = await import(`../events/${file}`);
            const eventData = event.default;
            if (eventData.once) {
                client.once(eventData.name, (...args) => eventData.execute(...args, client));
            }
            else {
                client.on(eventData.name, (...args) => eventData.execute(...args, client));
            }
            console.log(chalk.blue(`  → Loaded event: ${file}`));
        }
        catch (error) {
            console.error(chalk.red(`  ✗ Failed to load ${file}:`), error);
        }
    }
    console.log(chalk.green(`✓ Loaded ${eventFiles.length} events`));
};
