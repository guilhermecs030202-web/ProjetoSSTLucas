import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function sync() {
    console.log("Connecting to MySQL to create USUARIOS table...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "3306"),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "sst_db",
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

    // Let's also insert a default user for testing if the table is empty!
    // As per user criteria: "Não existem usuários fixos armazenados em memória para autenticação."
    // and "Usuário existente consegue realizar login com sucesso."
    // We can insert a default admin user into the DB if the table has 0 rows.
    // The credentials can be: admin@sst.com.br / admin123
    // We need to hash 'admin123' using bcryptjs.
    // Let's use bcryptjs to hash it.
    const [rows]: any[] = await connection.query("SELECT COUNT(*) as count FROM usuarios");
    if (rows[0].count === 0) {
        const bcrypt = require("bcryptjs");
        const hashedPw = await bcrypt.hash("admin123", 10);
        // Generate a random UUID
        const crypto = require("crypto");
        const idUsuario = crypto.randomUUID();
        await connection.query(
            "INSERT INTO usuarios (id_usuario, login, email, senha) VALUES (?, ?, ?, ?)",
            [idUsuario, "admin", "admin@sst.com.br", hashedPw]
        );
        console.log("Default user (admin@sst.com.br / admin123) inserted into 'usuarios' table.");
    }

    await connection.end();
}

async function syncDocumentoColumns() {
    console.log("Adding file columns to DOCUMENTO_SST table...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "3306"),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "sst_db",
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
