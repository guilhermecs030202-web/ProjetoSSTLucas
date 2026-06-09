import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { app } from "./app";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado com sucesso!");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => console.log("Erro ao conectar no banco de dados", error));
