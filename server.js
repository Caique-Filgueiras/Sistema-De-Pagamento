const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos estáticos, como o index.html

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/sistema_pagamento', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Model de Pagamento
const pagamentoSchema = new mongoose.Schema({
  tipo: String,
  dados: Object
});

const Pagamento = mongoose.model('Pagamento', pagamentoSchema);

// Rota para processar pagamento
app.post('/api/pagamento', (req, res) => {
  const { tipo, dados } = req.body;

  if (!tipo || !dados) {
    return res.status(400).send({ message: 'Dados inválidos.' });
  }

  const novoPagamento = new Pagamento({ tipo, dados });

  novoPagamento.save()
    .then(() => res.status(201).send({ message: 'Pagamento realizado com sucesso!' }))
    .catch(err => res.status(500).send({ message: 'Erro ao processar o pagamento.', error: err }));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
