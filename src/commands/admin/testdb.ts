import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('testdb')
    .setDescription('Test database access (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    // Disable in production
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEBUG_COMMANDS !== 'true') {
      const embed = EmbedFactory.error(
        'Command Disabled',
        'This debug command is disabled in production mode.\n\nTo enable, set `ENABLE_DEBUG_COMMANDS=true` in your .env file.'
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const db = getDatabase();
      const guildId = interaction.guildId!;

      let output = `**Database Test for Guild: ${guildId}**\n\n`;

      // Test 1: Direct path
      output += `**Test 1: Direct Path** (\`levels.${guildId}\`)\n`;
      const directData = await db.get(`levels.${guildId}`);
      if (directData) {
        const userCount = Object.keys(directData).length;
        output += `✅ Found ${userCount} users\n`;
        output += `User IDs: ${Object.keys(directData).slice(0, 5).join(', ')}\n\n`;
      } else {
        output += `❌ No data found\n\n`;
      }

      // Test 2: Parent path
      output += `**Test 2: Parent Path** (\`levels\`)\n`;
      const parentData = await db.get('levels');
      if (parentData) {
        const guilds = Object.keys(parentData);
        output += `✅ Found ${guilds.length} guilds\n`;
        output += `Guild IDs: ${guilds.join(', ')}\n`;
        
        if (parentData[guildId]) {
          const userCount = Object.keys(parentData[guildId]).length;
          output += `✅ This guild has ${userCount} users\n`;
          
          // Show sample user
          const firstUserId = Object.keys(parentData[guildId])[0];
          const firstUser = parentData[guildId][firstUserId];
          output += `\nSample user:\n`;
          output += `- ID: ${firstUser.id}\n`;
          output += `- Level: ${firstUser.level}\n`;
          output += `- XP: ${firstUser.xp}\n`;
          output += `- Total XP: ${firstUser.totalXP}\n`;
        } else {
          output += `❌ This guild not found in parent\n`;
        }
      } else {
        output += `❌ No parent data found\n`;
      }

      const embed = EmbedFactory.info('Database Test Results')
        .setDescription(output);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Test DB error:', error);
      const errorEmbed = EmbedFactory.error('Error', `Test failed: ${error}`);
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
