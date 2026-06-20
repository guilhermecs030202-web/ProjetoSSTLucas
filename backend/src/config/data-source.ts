import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Empresa } from "../entities/Empresa";
import { Cargo } from "../entities/Cargo";
import { Funcionario } from "../entities/Funcionario";
import { MembroCipa } from "../entities/MembroCipa";
import { DocumentoSst } from "../entities/DocumentoSst";
import { Treinamento } from "../entities/Treinamento";
import { AsoAtestado } from "../entities/AsoAtestado";
import { ExameClinico } from "../entities/ExameClinico";
import { AcidenteTrabalho } from "../entities/AcidenteTrabalho";
import { CompraEpi } from "../entities/CompraEpi";
import { CatalogoEpi } from "../entities/CatalogoEpi";
import { ItemCompraEpi } from "../entities/ItemCompraEpi";
import { DistribuicaoEpi } from "../entities/DistribuicaoEpi";
import { Usuario } from "../entities/Usuario";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || "3306"),
    username: process.env.DB_USER || process.env.MYSQLUSER || "sst_user",
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "sst_password",
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || "sst_db",
    synchronize: false, // Auto-create tables in development
    logging: false,
    entities: [
        Empresa,
        Cargo,
        Funcionario,
        MembroCipa,
        DocumentoSst,
        Treinamento,
        AsoAtestado,
        ExameClinico,
        AcidenteTrabalho,
        CompraEpi,
        CatalogoEpi,
        ItemCompraEpi,
        DistribuicaoEpi,
        Usuario
    ],
    migrations: [],
    subscribers: [],
});
