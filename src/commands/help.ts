import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('help').setDescription('Was kann ich?'),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Bot-Hilfe')
                    .setDescription('Dies ist die Dokumentation des Bots.\n\n__**Inhalt**__')
                    .setAuthor({ name: 'BotvonderTechnik' })
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
            ephemeral: true,
        });
    },
};
