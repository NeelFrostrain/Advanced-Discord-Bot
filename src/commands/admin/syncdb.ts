import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase, isUsingMongoDB } from '../../database/index.js';
import fs from 'fs/promises';
import path from 'path';

export default {
  data: new SlashCommandBuilder()
    .setName('syncdb')
    .setDescription('Sync JSON data to MongoDB (Admin only)')
    .addStringOption(option =>
      option.setName('direction')
        .setDescription('Sync direction')
        .addChoices(
          { name: 'JSON → MongoDB', value: 'json-to-mongo' },
          { name: 'MongoDB → JSON', value: 'mongo-to-json' }
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: true });

    const direction = interaction.options.getString('direction', true);

    try {
      const db = getDatabase();
      const startTime = Date.now();
      let syncedCount = 0;

      if (direction === 'json-to-mongo') {
        // Sync JSON → MongoDB
        if (!isUsingMongoDB()) {
          const embed = EmbedFactory.warning(
            'Not Using MongoDB',
            'Bot is currently using JSON database. Switch to MongoDB first.'
          );
          return interaction.editReply({ embeds: [embed] });
        }

        // Read JSON file
        const jsonPath = path.join(process.cwd(), 'database', 'json', 'data.json');
        const jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

        // Flatten and sync to MongoDB
        const flattenObject = (obj: any, prefix = ''): any => {
          const flattened: any = {};
          
          for (const [key, value] of Object.entries(obj)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              // Check if this is a data object (has 'id' field) or needs further flattening
              if ('id' in value || 'guildId' in value || 'userId' in value) {
                flattened[newKey] = value;
              } else {
                Object.assign(flattened, flattenObject(value, newKey));
              }
            } else {
              flattened[newKey] = value;
            }
          }
          
          return flattened;
        };

        const flattened = flattenObject(jsonData);

        // Sync each path to MongoDB
        for (const [path, value] of Object.entries(flattened)) {
          await db.set(path, value);
          syncedCount++;
        }

        const duration = Date.now() - startTime;

        const embed = EmbedFactory.success(
          '✅ Sync Complete: JSON → MongoDB',
          `Successfully synced ${syncedCount} entries from JSON to MongoDB!`
        )
          .addFields(
            { name: '⏱️ Duration', value: `${duration}ms`, inline: true },
            { name: '📊 Entries', value: `${syncedCount}`, inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

      } else {
        // Sync MongoDB → JSON (use existing backup function)
        if (!isUsingMongoDB()) {
          const embed = EmbedFactory.warning(
            'Not Using MongoDB',
            'Bot is currently using JSON database. No sync needed.'
          );
          return interaction.editReply({ embeds: [embed] });
        }

        // Get all data from MongoDB
        const allData = await db.all?.() || {};

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
          syncedCount++;
        }

        // Save to JSON
        const jsonPath = path.join(process.cwd(), 'database', 'json', 'data.json');
        await fs.writeFile(jsonPath, JSON.stringify(reconstructed, null, 2), 'utf-8');

        const duration = Date.now() - startTime;

        const embed = EmbedFactory.success(
          '✅ Sync Complete: MongoDB → JSON',
          `Successfully synced ${syncedCount} entries from MongoDB to JSON!`
        )
          .addFields(
            { name: '⏱️ Duration', value: `${duration}ms`, inline: true },
            { name: '📊 Entries', value: `${syncedCount}`, inline: true },
            { name: '📁 Location', value: 'database/json/data.json', inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
      }

    } catch (error) {
      console.error('Sync DB error:', error);
      const errorEmbed = EmbedFactory.error(
        'Sync Failed',
        `Failed to sync database: ${error}`
      );
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
