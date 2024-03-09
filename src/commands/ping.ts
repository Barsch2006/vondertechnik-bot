import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('ping'),
    async execute(interaction: CommandInteraction): Promise<void> {
        if (!interaction.isRepliable()) {
            console.error('Gegebene interaction kann nicht beantwortet werden.');
            return;
        }

        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

        try {
            await interaction.editReply({
                content: `PONG!\nCurrent Bot latency: ${interaction.client.ws.ping}ms\nRoundtrip latency: ${
                    sent.createdTimestamp - interaction.createdTimestamp
                }ms`,
            });
        } catch (err) {
            console.error(`Ping konnte nicht gesendet werden. Error ${JSON.stringify(err)}`);
        }
    },
};
