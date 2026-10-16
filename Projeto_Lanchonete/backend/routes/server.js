import express from "express";
import lanchesRoutes from "./lanchesRoutes.js";
import corsMiddlewares from "../middlewares/corsMiddlewares.js";
import { testarConexao } from "../database/conexao.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddlewares);
app.use(express.json());
app.use("/lanches", lanchesRoutes);

async function iniciarServidor() {
    try {
        await testarConexao();
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (erro) {
        console.error("Não foi possível iniciar o servidor:", erro);
        process.exitCode = 1;
    }
}

iniciarServidor();
