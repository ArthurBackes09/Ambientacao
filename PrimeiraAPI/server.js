import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Api funcionando');
});

app.get('/usuarios', (req, res) => {
  const usuarios = [
    { id: 1, nome: 'Arthur' },
  ];
  res.json(usuarios);
});

app.get('/eletronicos', (req, res) => {
  const eletronicos =[
    { id: 1, nome: 'Celular',},
    { id: 2, nome: 'Notebook',},
    { id: 3, nome: 'Tablet', }
  ];
  res.json(eletronicos);
});

app.post('/usuarios', (req, res) => {
  const novousuario = req.body;

  res.status(201).json({
    message: 'Usuário criado com sucesso',
    dados: novousuario
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}/`);
});