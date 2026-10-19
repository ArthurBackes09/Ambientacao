import { pool } from "../database/conexao.js";

const consultaLanche = `
    SELECT l.id, l.nome, l.descricao AS ingredientes, c.nome AS categoria, l.preco
    FROM lanches l
    LEFT JOIN categorias c ON c.id = l.id_categoria
`;

async function listarLanches(req, res) {
    try {
        const [lanches] = await pool.query(`${consultaLanche} ORDER BY l.id DESC`);
        return res.status(200).json(lanches);
    } catch (erro) {
        console.error("Erro ao buscar lanches:", erro);
        return res.status(500).json({ mensagem: "Erro ao buscar lanches." });
    }
}

async function buscarLanchePorId(req, res) {
    try {
        const [lanches] = await pool.query(
            `${consultaLanche} WHERE l.id = ?`,
            [req.params.id]
        );
        if (lanches.length === 0) {
            return res.status(404).json({ mensagem: "Lanche não encontrado." });
        }

        return res.status(200).json(lanches[0]);
    } catch (erro) {
        console.error("Erro ao buscar lanche:", erro);
        return res.status(500).json({ mensagem: "Erro ao buscar lanche." });
    }
}

async function obterIdCategoria(nome) {
    const [resultado] = await pool.query(
        "INSERT INTO categorias (nome) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)",
        [nome]
    );
    return resultado.insertId;
}

function validarLanche(lanche) {
    if (!lanche || typeof lanche !== "object") {
        return false;
    }

    const { nome, ingredientes, categoria, preco } = lanche;
    return (
        typeof nome === "string" && Boolean(nome.trim()) &&
        typeof ingredientes === "string" && Boolean(ingredientes.trim()) &&
        typeof categoria === "string" && Boolean(categoria.trim()) &&
        preco !== undefined && preco !== null && preco !== "" &&
        Number.isFinite(Number(preco)) && Number(preco) > 0
    );
}

async function cadastrarLanche(req, res) {
    if (!validarLanche(req.body)) {
        return res.status(400).json({ mensagem: "Preencha todos os campos com dados válidos." });
    }
    const { nome, ingredientes, categoria, preco } = req.body;

    try {
        const idCategoria = await obterIdCategoria(categoria.trim());
        const [resultado] = await pool.query(
            "INSERT INTO lanches (nome, descricao, id_categoria, preco) VALUES (?, ?, ?, ?)",
            [nome.trim(), ingredientes.trim(), idCategoria, Number(preco)]
        );

        return res.status(201).json({
            mensagem: "Lanche adicionado ao cardápio com sucesso!",
            id: resultado.insertId
        });
    } catch (erro) {
        console.error("Erro ao cadastrar lanche:", erro);
        return res.status(500).json({ mensagem: "Erro ao cadastrar lanche." });
    }
}

async function atualizarLanche(req, res) {
    if (!validarLanche(req.body)) {
        return res.status(400).json({ mensagem: "Preencha todos os campos com dados válidos." });
    }
    const { nome, ingredientes, categoria, preco } = req.body;

    try {
        const [lanches] = await pool.query(
            "SELECT id FROM lanches WHERE id = ?",
            [req.params.id]
        );
        if (lanches.length === 0) {
            return res.status(404).json({ mensagem: "Lanche não encontrado." });
        }

        const idCategoria = await obterIdCategoria(categoria.trim());
        await pool.query(
            "UPDATE lanches SET nome = ?, descricao = ?, id_categoria = ?, preco = ? WHERE id = ?",
            [nome.trim(), ingredientes.trim(), idCategoria, Number(preco), req.params.id]
        );

        return res.status(200).json({
            mensagem: "Lanche atualizado com sucesso!",
            id: req.params.id
        });
    } catch (erro) {
        console.error("Erro ao atualizar lanche:", erro);
        return res.status(500).json({ mensagem: "Erro ao atualizar lanche." });
    }
}

async function excluirLanche(req, res) {
    try {
        const [resultado] = await pool.query(
            "DELETE FROM lanches WHERE id = ?",
            [req.params.id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Lanche não encontrado." });
        }

        return res.status(200).json({ mensagem: "Lanche excluído do cardápio." });
    } catch (erro) {
        console.error("Erro ao excluir lanche:", erro);
        return res.status(500).json({ mensagem: "Erro ao excluir lanche." });
    }
}

export {
    listarLanches,
    buscarLanchePorId,
    cadastrarLanche,
    atualizarLanche,
    excluirLanche
};
