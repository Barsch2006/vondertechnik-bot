import { Routes, Client } from 'discord.js';
import { REST } from '@discordjs/rest';

export default (client: Client, commands: any[]): void => {
    if (process.env?.BOT_TOKEN === undefined) {
        console.error('BOT_TOKEN fehlt.');
        return;
    }
    if (process.env?.APPLICATION_ID === undefined) {
        console.error('APPLICATION_ID fehlt.');
        return;
    }

    console.log('Anzahl der Commands: ' + commands.length.toString());

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN ?? '');

    client.once('ready', async () => {
        console.log('Registriere Commands');

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const [_, g] of client.guilds.cache) {
            try {
                console.log(`Registriere Commands für Server ${g.name ?? '<Name nicht bekannt>'} #${g.id}`);
                await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID ?? '', g.id), {
                    body: [...commands],
                });
                console.log(`Commands für Server ${g.name ?? '<Name nicht bekannt>'} #${g.id} registriert`);
            } catch (err) {
                console.error(
                    `Commands konnten für Server ${g.name ?? '<Name nicht bekannt>'} #${g.id} : ${JSON.stringify(
                        err,
                        undefined,
                        2,
                    )}`,
                );
            }
        }
    });
};
