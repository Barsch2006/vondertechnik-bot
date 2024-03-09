import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';

export default {
    buttonId: /help-page3/,
    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Umfragen')
                    .setDescription(
                        'Umfragen sind etwas wertvolles, wenn man schnell möglichst viele Meinungen braucht.',
                    )
                    .setFields(
                        {
                            name: 'Einfache Umfrage',
                            value: 'Um eine Ja/Nein-Frage zu stellen, nutze `/poll`.',
                            inline: false,
                        },
                        {
                            name: 'Erweiterte Umfrage',
                            value: 'Um Umfragen mit bis zu 9 Antwortmöglichkeiten zu erstellen, nutze `/voting`.',
                            inline: false,
                        },
                    )
                    .setFooter({
                        text: 'Seite 3/4',
                    }),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel('Vorherige Seite')
                        .setEmoji('◀️')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('help-page2'),
                ),
            ],
        });
    },
};
