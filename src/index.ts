import { Client, IntentsBitField } from 'discord.js';
import { AsyncDatabase } from './sqlite';

import { config as dotenv } from 'dotenv';
import initInteractionHandler from './interactions';
dotenv();

const dbFile = process.env.DB ?? './sqlite.db';
const token = process.env.BOT_TOKEN;

if (!token) {
    console.error('Token is required');
    process.exit(0);
}

async function main(): Promise<void> {
    try {
        const db = await AsyncDatabase.open(dbFile);

        await db.serializeAsync(async () => {});

        const client = new Client({
            intents: [IntentsBitField.Flags.Guilds],
        });

        await initInteractionHandler(client, db);

        await client.login(token);
    } catch (error) {
        console.error(JSON.stringify(error, null, 2));
        process.exit(0);
    }
}

void main();
