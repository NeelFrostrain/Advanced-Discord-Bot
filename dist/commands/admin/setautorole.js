import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';
export default {
    data: new SlashCommandBuilder()
        .setName('setautorole')
        .setDescription('Configure auto-role for new members')
        .addSubcommand(subcommand => subcommand
        .setName('enable')
        .setDescription('Enable auto-role')
        .addRoleOption(option => option.setName('role')
        .setDescription('Role to give to new members')
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('disable')
        .setDescription('Disable auto-role'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const db = getDatabase();
        const settingsKey = `settings.${interaction.guildId}.autorole`;
        try {
            if (subcommand === 'enable') {
                const role = interaction.options.getRole('role', true);
                await db.set(settingsKey, {
                    enabled: true,
                    roleId: role.id
                });
                const embed = EmbedFactory.success('Auto-Role Enabled')
                    .setDescription(`New members will automatically receive ${role}`);
                await interaction.reply({ embeds: [embed] });
            }
            else if (subcommand === 'disable') {
                await db.set(settingsKey, { enabled: false });
                const embed = EmbedFactory.warning('Auto-Role Disabled', 'Auto-role has been turned off.');
                await interaction.reply({ embeds: [embed] });
            }
        }
        catch (error) {
            console.error('SetAutoRole command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to configure auto-role.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
