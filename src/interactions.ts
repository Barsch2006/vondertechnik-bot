import fs from 'fs';
import { join } from 'path';
import {
    Button,
    Command,
    Menu,
    MessageContextMenu,
    Modal,
    UserContextMenu,
    isButton,
    isCommand,
    isMenu,
    isMessageContextMenu,
    isModal,
    isUserContextMenu,
} from './commandTypes';
import { Client } from 'discord.js';
import { AsyncDatabase } from './sqlite';
import registerCommands from './actions/registerCommands';

export default async function initInteractionHandler(client: Client, db: AsyncDatabase) {
    const commands: Command[] = [];
    // command handling
    if (fs.existsSync(join(__dirname, 'commands'))) {
        const commandFiles = fs.readdirSync(join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = (await import(`./commands/${file}`)).default;
            // check if command is a valid command
            if (!command || !isCommand(command)) {
                console.error('Command file is not valid ' + file);
                continue;
            }
            commands.push(command);
            console.log(`Command ${command.data.name} loaded`);
            if (command.init) {
                command.init(client);
            }
        }
    }

    const buttons: Button[] = [];
    // button handling
    if (fs.existsSync(join(__dirname, 'buttons'))) {
        const buttonFiles = fs.readdirSync(join(__dirname, 'buttons')).filter((file) => file.endsWith('.js'));
        for (const file of buttonFiles) {
            const button = (await import(`./buttons/${file}`)).default;
            // check if button is a valid button
            if (!button || !isButton(button)) {
                console.error('Button file is not valid ' + file);
                continue;
            }
            buttons.push(button);
            console.log(`Button ${button.buttonId.toString()} loaded`);
        }
    }

    const menuInteractions: Menu[] = [];
    // menu handling
    if (fs.existsSync(join(__dirname, 'menuInteractions'))) {
        const menuFiles = fs.readdirSync(join(__dirname, 'menuInteractions')).filter((file) => file.endsWith('.js'));
        for (const file of menuFiles) {
            const menu = (await import(`./menuInteractions/${file}`)).default;
            // check if menu is a valid menu
            if (!menu || !isMenu(menu)) {
                console.error('Menu file is not valid ' + file);
                continue;
            }
            menuInteractions.push(menu);
            console.log(`Menu ${menu.customId.toString()} loaded`);
        }
    }

    const messageContextMenuInteractions: MessageContextMenu[] = [];
    // message context menu handling
    if (fs.existsSync(join(__dirname, 'messageContextMenuInteractions'))) {
        const messageContextMenuFiles = fs
            .readdirSync(join(__dirname, 'messageContextMenuInteractions'))
            .filter((file) => file.endsWith('.js'));
        for (const file of messageContextMenuFiles) {
            const messageContextMenu = (await import(`./messageContextMenuInteractions/${file}`)).default;
            // check if message context menu is a valid message context menu
            if (!messageContextMenu || !isMessageContextMenu(messageContextMenu)) {
                console.error('Message context menu file is not valid ' + file);
                continue;
            }
            messageContextMenuInteractions.push(messageContextMenu);
            console.log(`Message context menu ${messageContextMenu.data.name} loaded`);
        }
    }

    const modalInteractions: Modal[] = [];
    // modal handling
    if (fs.existsSync(join(__dirname, 'modalInteractions'))) {
        const modalFiles = fs.readdirSync(join(__dirname, 'modalInteractions')).filter((file) => file.endsWith('.js'));
        for (const file of modalFiles) {
            const modal = (await import(`./modalInteractions/${file}`)).default;
            // check if modal is a valid modal
            if (!modal || !isModal(modal)) {
                console.error('Modal file is not valid ' + file);
                continue;
            }
            modalInteractions.push(modal);
            console.log(`Modal ${modal.customId.toString()} loaded`);
        }
    }

    const userContextMenuInteractions: UserContextMenu[] = [];
    // user context menu handling
    if (fs.existsSync(join(__dirname, 'userContextMenuInteractions'))) {
        const userContextMenuFiles = fs
            .readdirSync(join(__dirname, 'userContextMenuInteractions'))
            .filter((file) => file.endsWith('.js'));
        for (const file of userContextMenuFiles) {
            const userContextMenu = (await import(`./userContextMenuInteractions/${file}`)).default;
            // check if user context menu is a valid user context menu
            if (!userContextMenu || !isUserContextMenu(userContextMenu)) {
                console.error('User context menu file is not valid ' + file);
                continue;
            }
            userContextMenuInteractions.push(userContextMenu);
            console.log(`User context menu ${userContextMenu.data.name} loaded`);
        }
    }

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            for await (const command of commands) {
                if (command.data.name === interaction.commandName) {
                    await command.execute(interaction);
                    return;
                }
            }
        }
        if (interaction.isButton()) {
            for await (const button of buttons) {
                if (button.buttonId instanceof RegExp) {
                    if (button.buttonId.test(interaction.customId)) {
                        await button.execute(interaction);
                        return;
                    }
                } else {
                    if (button.buttonId === interaction.customId) {
                        await button.execute(interaction);
                        return;
                    }
                }
            }
        }
        if (interaction.isStringSelectMenu()) {
            for await (const menu of menuInteractions) {
                if (menu.customId instanceof RegExp) {
                    if (menu.customId.test(interaction.customId)) {
                        await menu.execute(interaction);
                        return;
                    }
                } else {
                    if (menu.customId === interaction.customId) {
                        await menu.execute(interaction);
                        return;
                    }
                }
            }
        }

        if (interaction.isMessageContextMenuCommand()) {
            for await (const messageContextMenu of messageContextMenuInteractions) {
                if (interaction.commandName === messageContextMenu.data.name) {
                    await messageContextMenu.execute(interaction);
                    return;
                }
            }
        }

        if (interaction.isModalSubmit()) {
            for await (const modal of modalInteractions) {
                if (modal.customId instanceof RegExp) {
                    if (modal.customId.test(interaction.customId)) {
                        await modal.execute(interaction);
                        return;
                    }
                } else {
                    if (modal.customId === interaction.customId) {
                        await modal.execute(interaction);
                        return;
                    }
                }
            }
        }

        if (interaction.isUserContextMenuCommand()) {
            for await (const userContextMenu of userContextMenuInteractions) {
                if (interaction.commandName === userContextMenu.data.name) {
                    await userContextMenu.execute(interaction);
                    return;
                }
            }
        }
    });

    registerCommands(client, [
        ...commands.map((command) => command.data),
        ...messageContextMenuInteractions.map((messageContextMenu) => messageContextMenu.data),
        ...userContextMenuInteractions.map((userContextMenu) => userContextMenu.data),
    ]);
}
