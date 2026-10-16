import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../routes/.env", import.meta.url)) });

const pool = mysql.createPool({
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    waitForConnections: true,
    connectionLimit: 10
});

async function testarConexao() {
    let conexao;
    try {
        conexao = await pool.getConnection();
        await conexao.query("SELECT 1");
        console.log("Conexão com o banco realizada com sucesso!");
    } finally {
        if (conexao) {
            conexao.release();
        }
    }
}

export { pool, testarConexao };
