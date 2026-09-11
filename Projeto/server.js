import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'jogos_educacionais',
    waitForConnections: true,
    connectionLimit: 10
});

async function testarConexaoBanco() {
    try {
        const conexao = await pool.getConnection();
        await conexao.query('SELECT 1');
        conexao.release();
        console.log('Conexão com o banco realizada com sucesso!');
    } catch (erro) {
        console.error('Erro ao conectar com o banco:', erro);
        process.exit(1);
    }
}

app.get('/alunos', async (req, res) => {
    try {
        const [linhas] = await pool.query('SELECT * FROM aluno');
        res.json(linhas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({mensagem: 'Erro ao buscar alunos.'});
    }
});


app.get('/alunos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [linhas] = await pool.query(
        'SELECT * FROM aluno WHERE id = ?',
        [id]
        );

        if (linhas.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            });
        }

        res.json(linhas[0]);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({mensagem: 'Erro ao buscar aluno.'});
    }
});


app.post('/alunos', async (req, res) => {
    const {nome, data_nascimento, senha, email} = req.body;

    if (!nome || !data_nascimento || !senha || !email) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'INSERT INTO aluno (nome, data_nascimento, senha, email) VALUES (?, ?, ?, ?)',
        [nome, data_nascimento, senha, email]
        );

        res.status(201).json({
            mensagem: 'Aluno cadastrado com sucesso!',
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar aluno.'
        });
    }
});


app.put('/alunos/:id', async (req, res) => {
    const { id } = req.params;
    const {nome, data_nascimento, senha, email} = req.body;

    if (!nome || !data_nascimento || !senha || !email) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'UPDATE aluno SET nome = ?, data_nascimento = ?, senha = ?, email = ? WHERE id = ?',
        [nome, data_nascimento, senha, email, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            });
        }

        res.json({
            mensagem: 'Aluno atualizado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar aluno.'
        });
    }
});


app.delete('/alunos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [resultadoJ] = await pool.query(
        'DELETE FROM jogos_favoritos WHERE id_aluno = ?',
        [id]
        );

        const [resultadoR] = await pool.query(
        'DELETE FROM responsavel WHERE id_aluno = ?',
        [id]
        );

        const [resultado] = await pool.query(
        'DELETE FROM aluno WHERE id = ?',
        [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            });
        }

        res.json({
            mensagem: 'Aluno excluído com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao excluir aluno.'
        });
    }
});


app.get('/responsaveis', async (req, res) => {
    try {
        const [linhas] = await pool.query('SELECT * FROM responsavel');
        res.json(linhas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar responsáveis.'
        });
    }
});


app.get('/responsaveis/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [linhas] = await pool.query(
        'SELECT * FROM responsavel WHERE id = ?',
        [id]
        );

        if (linhas.length === 0) {
            return res.status(404).json({
                mensagem: 'Responsável não encontrado.'
            });
        }

        res.json(linhas[0]);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar responsável.'
        });
    }
});


app.post('/responsaveis', async (req, res) => {
    const {id_aluno, nome, data_nascimento, senha, email} = req.body;

    if (!id_aluno || !nome || !data_nascimento || !senha || !email) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'INSERT INTO responsavel (id_aluno, nome, data_nascimento, senha, email) VALUES (?, ?, ?, ?, ?)',
        [id_aluno, nome, data_nascimento, senha, email]
        );

        res.status(201).json({
            mensagem: 'Responsável cadastrado com sucesso!',
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar responsável.'
        });
    }
});


app.put('/responsaveis/:id', async (req, res) => {
    const { id } = req.params;
    const {id_aluno, nome, data_nascimento, senha, email} = req.body;

    if (!id_aluno || !nome || !data_nascimento || !senha || !email) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'UPDATE responsavel SET id_aluno = ?, nome = ?, data_nascimento = ?, senha = ?, email = ? WHERE id = ?',
        [id_aluno, nome, data_nascimento, senha, email, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Responsável não encontrado.'
            });
        }

        res.json({
            mensagem: 'Responsável atualizado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar responsável.'
        });
    }
});


app.delete('/responsaveis/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await pool.query(
        'DELETE FROM responsavel WHERE id = ?',
        [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Responsável não encontrado.'
            });
        }

        res.json({
            mensagem: 'Responsável excluído com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao excluir responsável.'
        });
    }
});


app.get('/jogos', async (req, res) => {
    try {
        const [linhas] = await pool.query('SELECT * FROM jogo');
        res.json(linhas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar jogos.'
        });
    }
});


app.get('/jogos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [linhas] = await pool.query(
        'SELECT * FROM jogo WHERE id = ?',
        [id]
        );

        if (linhas.length === 0) {
            return res.status(404).json({
                mensagem: 'Jogo não encontrado.'
            });
        }

        res.json(linhas[0]);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar jogo.'
        });
    }
});


app.post('/jogos', async (req, res) => {
    const {nome, descricao, materia, ano} = req.body;

    if (!nome || !materia || !ano) {
        return res.status(400).json({
            mensagem: 'Preencha os campos obrigatórios.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'INSERT INTO jogo (nome, descricao, materia, ano) VALUES (?, ?, ?, ?)',
        [nome, descricao, materia, ano]
        );

        res.status(201).json({
            mensagem: 'Jogo cadastrado com sucesso!',
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar jogo.'
        });
    }
});


app.put('/jogos/:id', async (req, res) => {
    const { id } = req.params;
    const {nome, descricao, materia, ano} = req.body;

    if (!nome || !materia || !ano) {
        return res.status(400).json({
            mensagem: 'Preencha os campos obrigatórios.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'UPDATE jogo SET nome = ?, descricao = ?, materia = ?, ano = ? WHERE id = ?',
        [nome, descricao, materia, ano, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Jogo não encontrado.'
            });
        }

        res.json({
            mensagem: 'Jogo atualizado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar jogo.'
        });
    }
});


app.delete('/jogos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [resultadoF] = await pool.query(
        'DELETE FROM jogos_favoritos WHERE id_jogo = ?',
        [id]
        );

        const [resultado] = await pool.query(
        'DELETE FROM jogo WHERE id = ?',
        [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Jogo não encontrado.'
            });
        }

        res.json({
            mensagem: 'Jogo excluído com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao excluir jogo.'
        });
    }
});


app.get('/jogos-favoritos', async (req, res) => {
    try {
        const [linhas] = await pool.query(
        'SELECT * FROM jogos_favoritos'
        );

        res.json(linhas);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar favoritos.'
        });
    }
});


app.get('/jogos-favoritos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [linhas] = await pool.query(
        'SELECT * FROM jogos_favoritos WHERE id = ?',
        [id]
        );

        if (linhas.length === 0) {
            return res.status(404).json({
                mensagem: 'Favorito não encontrado.'
            });
        }

        res.json(linhas[0]);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar favorito.'
        });
    }
});


app.post('/jogos-favoritos', async (req, res) => {
    const {id_jogo, id_aluno} = req.body;

    if (!id_jogo || !id_aluno) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'INSERT INTO jogos_favoritos (id_jogo, id_aluno) VALUES (?, ?)',
        [id_jogo, id_aluno]
        );

        res.status(201).json({
            mensagem: 'Jogo favorito cadastrado com sucesso!',
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar favorito.'
        });
    }
});


app.put('/jogos-favoritos/:id', async (req, res) => {
    const { id } = req.params;
    const {id_jogo, id_aluno} = req.body;

    if (!id_jogo || !id_aluno) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        const [resultado] = await pool.query(
        'UPDATE jogos_favoritos SET id_jogo = ?, id_aluno = ? WHERE id = ?',
        [id_jogo, id_aluno, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Favorito não encontrado.'
            });
        }

        res.json({
            mensagem: 'Favorito atualizado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar favorito.'
        });
    }
});


app.delete('/jogos-favoritos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await pool.query(
        'DELETE FROM jogos_favoritos WHERE id = ?',
        [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Favorito não encontrado.'
            });
        }

        res.json({
            mensagem: 'Favorito excluído com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao excluir favorito.'
        });
    }
});


app.get('/alunos-responsaveis', async (req, res) => {
    try {
        const [linhas] = await pool.query(`
        SELECT
            aluno.nome AS aluno,
            aluno.email AS email_aluno,
            responsavel.nome AS responsavel,
            responsavel.email AS email_responsavel
        FROM aluno
        INNER JOIN responsavel
        ON aluno.id = responsavel.id_aluno
        `);

        res.json(linhas);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar alunos e responsáveis.'
        });
    }
});


app.get('/alunos-jogos', async (req, res) => {
    try {
        const [linhas] = await pool.query(`
        SELECT
            aluno.nome AS aluno,
            jogo.nome AS jogo
        FROM aluno
        INNER JOIN jogos_favoritos
        ON aluno.id = jogos_favoritos.id_aluno
        INNER JOIN jogo
        ON jogos_favoritos.id_jogo = jogo.id
        `);

        res.json(linhas);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar alunos e jogos.'
        });
    }
});


app.listen(PORT, async () => {
    await testarConexaoBanco();
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});