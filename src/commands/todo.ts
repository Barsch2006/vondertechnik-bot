import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import { AsyncDatabase } from '../sqlite';

export default {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('create a todo')
        .addStringOption((option) => {
            return option.setName('todo').setDescription('Descriptive Name of the ToDo').setRequired(true);
        }),
    async execute(interaction: CommandInteraction): Promise<void> {
        if (!interaction.isRepliable()) {
            console.error('Gegebene interaction kann nicht beantwortet werden.');
            return;
        }

        try {
            const db = await AsyncDatabase.open();

            if (!db) {
                console.error('DB konnte nicht geöffnet werden.');
                return;
            }

            const todo = interaction.options.get('todo', true).value as string;

            const todoExists = await db.getAsync('SELECT * FROM todos WHERE todo = ?', [todo]);

            if (todoExists) {
                await interaction.reply({
                    content: 'Das ToDo existiert bereits.',
                    ephemeral: true,
                });
                return;
            }

            const todoChannel = interaction.guild?.channels.cache.find(
                (channel) => channel.name === 'todo-list' && channel.isTextBased(),
            ) as TextChannel;

            if (!todoChannel) {
                await interaction.reply({
                    content: 'ToDo-Channel nicht gefunden.',
                    ephemeral: true,
                });
                return;
            }

            const msg = await todoChannel.send({
                content: 'ToDo wird hinzugefügt..',
            });

            await interaction.reply({
                content: 'Acknowledged',
                ephemeral: true,
            });

            try {
                await db.runAsync('INSERT INTO todos (message_id, todo) VALUES (?, ?)', [msg.id, todo]);

                await msg.edit({
                    content: undefined,
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL(),
                            })
                            .setTitle('ToDo hinzugefügt')
                            .setDescription(todo)
                            .setTimestamp()
                            .setFields([
                                {
                                    name: 'Status',
                                    value: 'Open',
                                    inline: false,
                                },
                                {
                                    name: 'Assigned',
                                    value: 'None',
                                    inline: false,
                                },
                            ])
                            .setColor(Colors.White),
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setLabel('Assign to me')
                                .setEmoji('🙋‍♂️')
                                .setCustomId('self-assign-todo')
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setLabel('Set Status')
                                .setEmoji('⌛')
                                .setCustomId('set-todo-status')
                                .setStyle(ButtonStyle.Primary),
                        ),
                    ],
                });
            } catch (error) {
                console.error(JSON.stringify(error, null, 2));
                await interaction.editReply({
                    content: 'Fehler beim Hinzufügen des ToDos.',
                });
            }
        } catch (err) {
            console.error(`Error ${JSON.stringify(err)}`);
        }
    },
};
