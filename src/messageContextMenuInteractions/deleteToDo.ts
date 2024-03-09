import discord, {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    ContextMenuCommandBuilder,
    EmbedBuilder,
} from 'discord.js';
import { AsyncDatabase } from '../sqlite';

export default {
    data: new ContextMenuCommandBuilder()
        .setType(ApplicationCommandType.Message)
        .setName('Delete ToDo')
        .setDMPermission(false),
    async execute(interaction: discord.MessageContextMenuCommandInteraction): Promise<void> {
        const db = await AsyncDatabase.open();
        if (!db) {
            console.error('DB konnte nicht geöffnet werden.');
            return;
        }

        const todo = interaction.targetMessage.embeds[0].description;
        if (!todo) {
            await interaction.reply({
                content: 'Nachricht konnte nicht gefunden werden.',
                ephemeral: true,
            });
            return;
        }

        if (!interaction.targetMessage.author.bot) {
            await interaction.reply({
                content: 'Nur Nachrichten von Bots können als ToDos genutzt werden.',
                ephemeral: true,
            });
            return;
        }

        // check if the message is allready a todo
        const todoExists = await db.getAsync('SELECT * FROM todos WHERE message_id = ? OR todo = ?', [
            interaction.targetMessage.id,
            todo,
        ]);

        if (!todoExists) {
            await interaction.reply({
                content: 'Das ToDo existiert nicht.',
                ephemeral: true,
            });
            return;
        }

        const reply = await interaction.reply({
            content: 'ToDo löschen..',
            fetchReply: true,
        });

        try {
            await db.runAsync('DELETE FROM todos WHERE message_id = ?', [interaction.targetMessage.id]);
            await interaction.targetMessage.delete();
            await reply.edit({
                content: `ToDo *${todo}* von <@${interaction.member?.user.id}> gelöscht.`,
            });
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            await interaction.editReply({
                content: 'Fehler beim Hinzufügen des ToDos.',
            });
        }
    },
};
