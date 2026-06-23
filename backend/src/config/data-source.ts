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
    type: "postgres",
    host: process.env.DB_HOST || process.env.PGHOST || "localhost",
    port: parseInt(process.env.DB_PORT || process.env.PGPORT || "5432"),
    username: process.env.DB_USER || process.env.PGUSER || "sst_user",
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || "sst_password",
    database: process.env.DB_NAME || process.env.PGDATABASE || "sst_db",
    synchronize: false, // Use migrations in production
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
