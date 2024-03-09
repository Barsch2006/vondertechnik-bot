import { ActionRowBuilder, ButtonInteraction, Colors, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { AsyncDatabase } from 'src/sqlite';
import { ToDo } from 'src/types';

export default {
    buttonId: /set-todo-status/,
    async execute(interaction: ButtonInteraction): Promise<void> {
        const db = await AsyncDatabase.open();
        if (!db) {
            console.error('DB konnte nicht geöffnet werden.');
            return;
        }

        const todo = interaction.message.embeds[0].description;
        const mid = interaction.message.id;

        const todoExists: ToDo | undefined = await db.getAsync('SELECT * FROM todos WHERE message_id = ? OR todo = ?', [
            mid,
            todo,
        ]);
        if (!todoExists) {
            await interaction.reply({
                content: 'Das ToDo existiert nicht.',
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Setze den Status')
                    .setFooter({
                        text: todoExists.message_id,
                    })
                    .setColor(Colors.White)
                    .setTimestamp(),
            ],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('set-todo-status-menu')
                        .setPlaceholder('Status')
                        .addOptions([
                            {
                                label: 'Open',
                                value: '0',
                            },
                            {
                                label: 'In Progress',
                                value: '1',
                            },
                            {
                                label: 'Done',
                                value: '2',
                            },
                        ])
                        .setMaxValues(1)
                        .setMinValues(1),
                ),
            ],
            ephemeral: true,
        });
    },
};
