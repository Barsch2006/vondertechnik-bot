import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';

export default {
    buttonId: /help-page1/,
    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Bot-Hilfe')
                    .setDescription('Dies ist die Dokumentation des Bots.\n\n__**Inhalt**__')
                    .addFields(
                        {
                            name: 'Informationen',
                            value: 'Nachrichten, in denen Nutzer Informationen erhalten - Seite 2',
                            inline: false,
                        },
                        { name: 'Umfragen', value: 'Umfragen auf diesem Server - Seite 3', inline: false },
                    )
                    .setFooter({
                        text: 'Seite 1/3',
                    }),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel('Nächste Seite')
                        .setEmoji('▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('help-page2'),
                ),
            ],
        });
    },
};
