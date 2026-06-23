import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function sync() {
    console.log("Connecting to PostgreSQL to create USUARIOS table...");
    const client = new Client({
        host: process.env.DB_HOST || process.env.PGHOST || "localhost",
        port: parseInt(process.env.DB_PORT || process.env.PGPORT || "5432"),
        user: process.env.DB_USER || process.env.PGUSER || "postgres",
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
        database: process.env.DB_NAME || process.env.PGDATABASE || "sst_db",
    });

    await client.connect();
    console.log("Connected to PostgreSQL.");

    // We name the table 'usuarios' in lowercase as per other tables in the sst_db
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario UUID PRIMARY KEY,
            login VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL
        );
    `;

    await client.query(createTableQuery);
    console.log("Table 'usuarios' created or verified successfully.");

    // Configurações do administrador inicial via variáveis de ambiente
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@sst.com.br";
    const adminLogin = process.env.INITIAL_ADMIN_LOGIN || "admin";
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "admin123";

    const res = await client.query("SELECT COUNT(*) as count FROM usuarios");
    const count = parseInt(res.rows[0].count);
    
    if (count === 0) {
        const bcrypt = require("bcryptjs");
        const hashedPw = await bcrypt.hash(adminPassword, 10);
        const crypto = require("crypto");
        const idUsuario = crypto.randomUUID();
        await client.query(
            "INSERT INTO usuarios (id_usuario, login, email, senha) VALUES ($1, $2, $3, $4)",
            [idUsuario, adminLogin, adminEmail, hashedPw]
        );
        console.log(`Default user (${adminEmail} / ${adminLogin}) inserted into 'usuarios' table.`);
    }

    await client.end();
}

async function syncDocumentoColumns() {
    console.log("Adding file columns to DOCUMENTO_SST and other tables...");
    const client = new Client({
        host: process.env.DB_HOST || process.env.PGHOST || "localhost",
        port: parseInt(process.env.DB_PORT || process.env.PGPORT || "5432"),
        user: process.env.DB_USER || process.env.PGUSER || "postgres",
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
        database: process.env.DB_NAME || process.env.PGDATABASE || "sst_db",
    });

    await client.connect();

    // TypeORM cria tabelas com nomes em maiúsculas — usamos aspas para referenciar corretamente
    const alterQueries = [
        `ALTER TABLE "DOCUMENTO_SST" ADD COLUMN IF NOT EXISTS nome_arquivo VARCHAR(255)`,
        `ALTER TABLE "DOCUMENTO_SST" ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100)`,
        `ALTER TABLE "DOCUMENTO_SST" ADD COLUMN IF NOT EXISTS tamanho_arquivo INT`,
        `ALTER TABLE "DOCUMENTO_SST" ADD COLUMN IF NOT EXISTS caminho_arquivo VARCHAR(500)`,

        `ALTER TABLE "TREINAMENTO" ADD COLUMN IF NOT EXISTS nome_arquivo VARCHAR(255)`,
        `ALTER TABLE "TREINAMENTO" ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100)`,
        `ALTER TABLE "TREINAMENTO" ADD COLUMN IF NOT EXISTS tamanho_arquivo INT`,
        `ALTER TABLE "TREINAMENTO" ADD COLUMN IF NOT EXISTS caminho_arquivo VARCHAR(500)`,

        `ALTER TABLE "ACIDENTE_TRABALHO" ADD COLUMN IF NOT EXISTS nome_arquivo VARCHAR(255)`,
        `ALTER TABLE "ACIDENTE_TRABALHO" ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100)`,
        `ALTER TABLE "ACIDENTE_TRABALHO" ADD COLUMN IF NOT EXISTS tamanho_arquivo INT`,
        `ALTER TABLE "ACIDENTE_TRABALHO" ADD COLUMN IF NOT EXISTS caminho_arquivo VARCHAR(500)`,
    ];

    for (const q of alterQueries) {
        try {
            await client.query(q);
        } catch (err: any) {
            // 42701 = duplicate_column, 42P01 = undefined_table (tabela ainda não existe)
            if (err.code !== '42701' && err.code !== '42P01') throw err;
            console.warn(`  Aviso ignorado (${err.code}): ${err.message}`);
        }
    }

    console.log("File columns added/verified.");
    await client.end();
}

(async () => {
    try {
        await sync();
        await syncDocumentoColumns();
    } catch (err) {
        console.error("Error syncing database:", err);
        process.exit(1);
    }
})();
