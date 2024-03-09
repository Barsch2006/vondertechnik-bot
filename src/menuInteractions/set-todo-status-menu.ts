import {
    Colors,
    EmbedBuilder,
    StringSelectMenuInteraction,
} from 'discord.js';
import { AsyncDatabase } from '../sqlite';
import { ToDo } from 'src/types';

export default {
    customId: /set-todo-status-menu/,
    async execute(interaction: StringSelectMenuInteraction): Promise<void> {
        const db = await AsyncDatabase.open();
        if (!db) {
            console.error('DB konnte nicht geöffnet werden.');
            return;
        }

        const todo = interaction.message.embeds[0].footer?.text;
        const mid = interaction.message.id;

        const todoExists: ToDo | undefined = await db.getAsync('SELECT * FROM todos WHERE message_id = ?', [todo]);
        if (!todoExists) {
            await interaction.reply({
                content: 'Das ToDo existiert nicht.',
                ephemeral: true,
            });
            return;
        }

        await db.runAsync('UPDATE todos SET status = ? WHERE message_id = ?', [parseInt(interaction.values[0]), todo]);

        const todoMsg = await interaction.channel?.messages.fetch(todoExists.message_id);

        if (!todoMsg) {
            await interaction.reply({
                content: 'Die Nachricht konnte nicht gefunden werden.',
                ephemeral: true,
            });
            return;
        }

        await todoMsg.edit({
            content: undefined,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.message.embeds[0].author?.name || interaction.user.username,
                        iconURL: interaction.message.embeds[0].author?.iconURL || undefined,
                    })
                    .setTitle('ToDo hinzugefügt')
                    .setDescription(todoExists.todo)
                    .setTimestamp()
                    .setFields([
                        {
                            name: 'Status',
                            value:
                                interaction.values[0] === '0'
                                    ? 'Open'
                                    : interaction.values[0] === '1'
                                      ? 'In Progress'
                                      : 'Done',
                            inline: false,
                        },
                        {
                            name: 'Assigned',
                            value:
                                todoExists.assigned_to
                                    ?.split(',')
                                    .map((u) => `<@${u}>`)
                                    .join('\n') || 'None',
                            inline: false,
                        },
                    ])
                    .setColor(Colors.White),
            ],
        });

        await interaction.reply({
            content: 'Status gesetzt.',
            ephemeral: true,
        });
    },
};
