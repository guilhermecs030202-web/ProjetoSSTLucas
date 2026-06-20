import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function sync() {
    console.log("Connecting to MySQL to create USUARIOS table...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
        port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || "3306"),
        user: process.env.DB_USER || process.env.MYSQLUSER || "root",
        password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
        database: process.env.DB_NAME || process.env.MYSQLDATABASE || "sst_db",
    });

    console.log("Connected to MySQL.");

    // We name the table 'usuarios' in lowercase as per other tables in the sst_db
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario VARCHAR(36) NOT NULL,
            login VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            senha VARCHAR(255) NOT NULL,
            PRIMARY KEY (id_usuario),
            UNIQUE KEY UQ_usuario_login (login),
            UNIQUE KEY UQ_usuario_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(createTableQuery);
    console.log("Table 'usuarios' created or verified successfully.");

    // Configurações do administrador inicial via variáveis de ambiente
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@sst.com.br";
    const adminLogin = process.env.INITIAL_ADMIN_LOGIN || "admin";
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "admin123";

    const [rows]: any[] = await connection.query("SELECT COUNT(*) as count FROM usuarios");
    if (rows[0].count === 0) {
        const bcrypt = require("bcryptjs");
        const hashedPw = await bcrypt.hash(adminPassword, 10);
        const crypto = require("crypto");
        const idUsuario = crypto.randomUUID();
        await connection.query(
            "INSERT INTO usuarios (id_usuario, login, email, senha) VALUES (?, ?, ?, ?)",
            [idUsuario, adminLogin, adminEmail, hashedPw]
        );
        console.log(`Default user (${adminEmail} / ${adminLogin}) inserted into 'usuarios' table.`);
    }

    await connection.end();
}

async function syncDocumentoColumns() {
    console.log("Adding file columns to DOCUMENTO_SST table...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
        port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || "3306"),
        user: process.env.DB_USER || process.env.MYSQLUSER || "root",
        password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
        database: process.env.DB_NAME || process.env.MYSQLDATABASE || "sst_db",
    });

    const alterQueries = [
        "ALTER TABLE DOCUMENTO_SST ADD COLUMN nome_arquivo VARCHAR(255) NULL",
        "ALTER TABLE DOCUMENTO_SST ADD COLUMN mime_type VARCHAR(100) NULL",
        "ALTER TABLE DOCUMENTO_SST ADD COLUMN tamanho_arquivo INT NULL",
        "ALTER TABLE DOCUMENTO_SST ADD COLUMN caminho_arquivo VARCHAR(500) NULL",

        "ALTER TABLE TREINAMENTO ADD COLUMN nome_arquivo VARCHAR(255) NULL",
        "ALTER TABLE TREINAMENTO ADD COLUMN mime_type VARCHAR(100) NULL",
        "ALTER TABLE TREINAMENTO ADD COLUMN tamanho_arquivo INT NULL",
        "ALTER TABLE TREINAMENTO ADD COLUMN caminho_arquivo VARCHAR(500) NULL",

        "ALTER TABLE ACIDENTE_TRABALHO ADD COLUMN nome_arquivo VARCHAR(255) NULL",
        "ALTER TABLE ACIDENTE_TRABALHO ADD COLUMN mime_type VARCHAR(100) NULL",
        "ALTER TABLE ACIDENTE_TRABALHO ADD COLUMN tamanho_arquivo INT NULL",
        "ALTER TABLE ACIDENTE_TRABALHO ADD COLUMN caminho_arquivo VARCHAR(500) NULL",
    ];

    for (const q of alterQueries) {
        try {
            await connection.query(q);
        } catch (err: any) {
            // Ignore "duplicate column" errors
            if (err.code !== 'ER_DUP_FIELDNAME') throw err;
        }
    }

    console.log("File columns added/verified on DOCUMENTO_SST.");
    await connection.end();
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
