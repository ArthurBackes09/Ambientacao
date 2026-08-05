import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Api funcionando');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});