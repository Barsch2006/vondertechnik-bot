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

        await db.serializeAsync(async () => {
            await db.runAsync(`CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
                message_id TEXT NOT NULL UNIQUE,
                todo TEXT NOT NULL UNIQUE,
                status INTEGER NOT NULL DEFAULT 0,
                assigned_to TEXT
            )`);
        });

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
