# Brasa & Pão — Sistema de Lanchonete

Sistema para cadastrar, consultar, editar e excluir lanches do cardápio. Cada lanche usa os campos `nome`, `ingredientes`, `categoria` e `preco`.

## Banco de dados

O banco e as tabelas não estão incluídos neste projeto. Crie-os no MySQL e configure a conexão localmente:

1. Copie `backend/routes/.env.example` para `backend/routes/.env`.
2. Preencha host, porta, usuário, senha e nome do banco que você criou.
3. Crie uma tabela `lanches` compatível com os campos `id`, `nome`, `ingredientes`, `categoria` e `preco`.

## Iniciar

No terminal, abra a pasta `backend` e execute:

```bash
npm install
npm start
```

Depois de configurar o banco e iniciar a API, abra `frontend/index.html` com o Live Server do VS Code. A API usa `http://localhost:3000/lanches`.
