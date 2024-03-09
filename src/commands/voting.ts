import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder, escapeMarkdown } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('voting')
        .setDescription('Eine Umfrage / Abstimmung machen.')
        .addStringOption((option) => option.setName('question').setDescription('Die Frage').setRequired(true))
        .addStringOption((option) =>
            option.setName('answers').setDescription('Die Antworten, mit Kommata getrennt').setRequired(true),
        ),
    async execute(interaction: CommandInteraction): Promise<void> {
        const question = escapeMarkdown(interaction.options.get('question', true).value?.toString() ?? '');
        const answers = escapeMarkdown(interaction.options.get('answers', true).value?.toString() ?? '')
            .split(',')
            .map((value) => value.trim());

        const emojis = ['🟢', '🔴', '🟠', '🟡', '🔵', '🟣', '🟤', '⚪', '⚫'];

        if (question === '' || answers.length < 2) {
            await interaction.reply({
                content: 'Die Parameter wurden falsch ausgefüllt.',
                ephemeral: true,
            });
            return;
        }
        if (answers.length > 10) {
            await interaction.reply({
                content: 'Die maximale Anzahl an Antwortmöglichkeiten ist 9',
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder().setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
        })
        .setColor(Colors.Blue)
        .setTitle('Umfrage')
        .setDescription(`<@${interaction.member?.user.id as string}> _fragt:_ ${question}`)
        .setTimestamp()
        .setFields(answers.map((value, index) => ({
            name: `${emojis[index]} - ${value}`,
            value: '\u200B',
            inline: false,
        })));

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });

        for (let i = 0; i < answers.length; i++) {
            await message.react(emojis[i]);
        }
    },
};
