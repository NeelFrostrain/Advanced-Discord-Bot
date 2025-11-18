import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';
export default {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Create a reaction role message')
        .addStringOption(option => option.setName('title')
        .setDescription('Title of the message')
        .setRequired(true))
        .addStringOption(option => option.setName('description')
        .setDescription('Description of the message')
        .setRequired(true))
        .addRoleOption(option => option.setName('role1')
        .setDescription('First role')
        .setRequired(true))
        .addStringOption(option => option.setName('emoji1')
        .setDescription('Emoji for first role')
        .setRequired(true))
        .addRoleOption(option => option.setName('role2')
        .setDescription('Second role')
        .setRequired(false))
        .addStringOption(option => option.setName('emoji2')
        .setDescription('Emoji for second role')
        .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const title = interaction.options.getString('title', true);
        const description = interaction.options.getString('description', true);
        const roles = [];
        const emojis = [];
        for (let i = 1; i <= 2; i++) {
            const role = interaction.options.getRole(`role${i}`);
            const emoji = interaction.options.getString(`emoji${i}`);
            if (role && emoji) {
                roles.push(role);
                emojis.push(emoji);
            }
        }
        try {
            let desc = description + '\n\n';
            roles.forEach((role, index) => {
                desc += `${emojis[index]} - ${role}\n`;
            });
            const embed = EmbedFactory.info(title)
                .setDescription(desc);
            const message = await interaction.channel?.send({ embeds: [embed] });
            if (message) {
                for (const emoji of emojis) {
                    await message.react(emoji);
                }
                const db = getDatabase();
                const reactionRoleKey = `reactionroles.${interaction.guildId}.${message.id}`;
                await db.set(reactionRoleKey, roles.map((role, index) => ({
                    roleId: role.id,
                    emoji: emojis[index]
                })));
            }
            const successEmbed = EmbedFactory.success('Reaction Role Created!', 'Users can now react to get roles.');
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        }
        catch (error) {
            console.error('ReactionRole command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to create reaction role message.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
