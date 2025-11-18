import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import ms from 'ms';
export default {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set a reminder')
        .addStringOption(option => option.setName('time')
        .setDescription('Time until reminder (e.g., 10m, 1h, 1d)')
        .setRequired(true))
        .addStringOption(option => option.setName('message')
        .setDescription('Reminder message')
        .setRequired(true)),
    async execute(interaction, client) {
        const time = interaction.options.getString('time', true);
        const message = interaction.options.getString('message', true);
        const duration = ms(time);
        if (!duration || duration > 2592000000) {
            const embed = EmbedFactory.error('Invalid Time', 'Invalid time! Max is 30 days.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const embed = EmbedFactory.success('Reminder Set')
            .setDescription(`⏰ I'll remind you in **${time}** about: ${message}`);
        await interaction.reply({ embeds: [embed] });
        setTimeout(async () => {
            const reminderEmbed = EmbedFactory.warning('Reminder!')
                .setDescription(message)
                .setFooter({ text: `Reminder from ${time} ago` });
            try {
                await interaction.user.send({ embeds: [reminderEmbed] });
            }
            catch (error) {
                await interaction.followUp({
                    content: `${interaction.user} ⏰ Reminder: ${message}`,
                    embeds: [reminderEmbed]
                }).catch(() => { });
            }
        }, duration);
    }
};
