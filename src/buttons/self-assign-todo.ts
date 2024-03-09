import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';
import { AsyncDatabase } from '../sqlite';
import { ToDo } from '../types';

export default {
    buttonId: /self-assign-todo/,
    async execute(interaction: ButtonInteraction): Promise<void> {
        const db = await AsyncDatabase.open();
        if (!db) {
            console.error('DB konnte nicht geöffnet werden.');
            return;
        }

        const todo = interaction.message.embeds[0].description;
        const mid = interaction.message.id;
        const uid = interaction.user.id;

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

        const assigned = todoExists.assigned_to?.split(',') || [];
        if (assigned.includes(uid)) {
            assigned.splice(assigned.indexOf(uid), 1);
        } else assigned.push(uid);

        await db.runAsync('UPDATE todos SET assigned_to = ? WHERE message_id = ?', [assigned.join(','), mid]);

        await interaction.update({
            content: undefined,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.message.embeds[0].author?.name || interaction.user.username,
                        iconURL: interaction.message.embeds[0].author?.iconURL || undefined,
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
                            value: assigned.map((u) => `<@${u}>`).join('\n') || 'None',
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
    },
};
