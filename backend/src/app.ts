import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"];

// Aceita qualquer subdomínio da Vercel automaticamente
const vercelOriginRegex = /\.vercel\.app$/;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes("*") ||
            allowedOrigins.includes(origin) ||
            vercelOriginRegex.test(origin)
        ) {
            callback(null, true);
        } else {
            callback(new Error("Não permitido pelo CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use("/api", routes);

export { app };
