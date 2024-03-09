import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';

export default {
    buttonId: /help-page2/,
    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Informationen erhalten')
                    .setDescription('Dieser Bot enthält Befehle, die nur eine Nachricht mit Informationen verschicken.')
                    .addFields(
                        { name: '/help', value: 'Die Hilfe-Seite dieses Bots', inline: false },
                        { name: '/ping', value: 'Prüft, ob der Bot online ist', inline: false },
                    )
                    .setFooter({
                        text: 'Seite 2/4',
                    }),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel('Vorherige Seite')
                        .setEmoji('◀️')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('help-page1'),
                    new ButtonBuilder()
                        .setLabel('Nächste Seite')
                        .setEmoji('▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('help-page3'),
                ),
            ],
        });
    },
};
