import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { ExtendedClient } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client: ExtendedClient) => {
  const commandsPath = join(__dirname, '../commands');
  const commandFolders = readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = join(commandsPath, folder);
    const commandFiles = readdirSync(folderPath).filter(file => 
      file.endsWith('.js') || file.endsWith('.ts')
    );

    for (const file of commandFiles) {
      try {
        const command = await import(`../commands/${folder}/${file}`);
        const commandData = command.default;

        if ('data' in commandData && 'execute' in commandData) {
          client.commands.set(commandData.data.name, commandData);
          console.log(chalk.blue(`  → Loaded command: ${folder}/${file}`));
        } else {
          console.log(chalk.yellow(`  ⚠ Skipping ${folder}/${file}: missing data or execute`));
        }
      } catch (error) {
        console.error(chalk.red(`  ✗ Failed to load ${folder}/${file}:`), error);
      }
    }
  }

  console.log(chalk.green(`✓ Loaded ${client.commands.size} commands`));
};
