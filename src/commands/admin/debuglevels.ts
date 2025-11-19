import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('debuglevels')
    .setDescription('Debug level data (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const db = getDatabase();
      const guildId = interaction.guildId!;

      // Try multiple paths
      const directPath = await db.get(`levels.${guildId}`);
      const parentPath = await db.get('levels');
      
      let debugInfo = '**Debug Information**\n\n';
      
      // Check direct path
      debugInfo += `**Direct Path** (\`levels.${guildId}\`):\n`;
      if (directPath) {
        const userCount = Object.keys(directPath).length;
        debugInfo += `✅ Found ${userCount} users\n`;
        debugInfo += '```json\n' + JSON.stringify(directPath, null, 2).substring(0, 500) + '\n```\n\n';
      } else {
        debugInfo += `❌ No data found\n\n`;
      }

      // Check parent path
      debugInfo += `**Parent Path** (\`levels\`):\n`;
      if (parentPath) {
        const guilds = Object.keys(parentPath);
        debugInfo += `✅ Found ${guilds.length} guilds\n`;
        debugInfo += `Guild IDs: ${guilds.join(', ')}\n`;
        
        if (parentPath[guildId]) {
          const userCount = Object.keys(parentPath[guildId]).length;
          debugInfo += `✅ This guild has ${userCount} users\n`;
        } else {
          debugInfo += `❌ This guild not found in parent\n`;
        }
      } else {
        debugInfo += `❌ No parent data found\n`;
      }

      // Split into multiple messages if too long
      const chunks = debugInfo.match(/[\s\S]{1,1900}/g) || [debugInfo];
      
      for (let i = 0; i < chunks.length; i++) {
        const embed = EmbedFactory.info(`Debug Levels (${i + 1}/${chunks.length})`)
          .setDescription(chunks[i]);
        
        if (i === 0) {
          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
      }

    } catch (error) {
      console.error('Debug levels error:', error);
      const errorEmbed = EmbedFactory.error('Error', `Failed to debug: ${error}`);
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
