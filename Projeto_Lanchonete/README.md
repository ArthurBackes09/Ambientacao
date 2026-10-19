# Brasa & Pão — Sistema de Lanchonete

Sistema para cadastrar, consultar, editar e excluir lanches do cardápio. Cada lanche usa os campos `nome`, `ingredientes`, `categoria` e `preco`.

O painel também mostra o total de lanches, a quantidade de categorias e o preço médio. Use a busca para localizar lanches por nome ou ingrediente e o filtro para consultar uma categoria específica. O formulário sugere categorias já usadas e permite informar novas.

## Banco de dados

O script `../Banco_Lanchonete.sql` cria o banco `lanchonete` e suas tabelas. Execute-o no MySQL Workbench ou pelo cliente MySQL antes de iniciar a API. O sistema usa as tabelas `lanches` e `categorias`; o campo de ingredientes do formulário é salvo em `lanches.descricao`.

1. Copie `backend/routes/.env.example` para `backend/routes/.env`.
2. Preencha host, porta, usuário, senha e nome do banco que você criou.
3. Configure `db_name=lanchonete`.

## Iniciar

No terminal, abra a pasta `backend` e execute:

```bash
npm install
node server.js
```

Depois de configurar o banco e iniciar a API, abra `frontend/index.html` com o Live Server do VS Code. A API usa `http://localhost:3000/lanches`.
