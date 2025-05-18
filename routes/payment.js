import express from 'express';
import Payment from '../models/payment.js';

const router = express.Router();

function gerarCodigoTransacao() {
  const now = new Date();
  return 'TXN-' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '-' + Math.floor(Math.random() * 1000000);
}

router.post('/', async (req, res) => {
  const { tipo, dados } = req.body;

  if (!tipo || !dados) {
    return res.status(400).json({ mensagem: 'Tipo e dados do pagamento são obrigatórios.' });
  }

  try {
    const codigo = gerarCodigoTransacao();

    await Payment.create({
      tipo,
      dados: { ...dados, codigoTransacao: codigo }
    });

    res.status(201).json({
      mensagem: 'Pagamento registrado com sucesso!',
      codigoTransacao: codigo
    });

  } catch (err) {
    res.status(500).json({
      mensagem: 'Erro ao registrar o pagamento.',
      erro: err.message
    });
  }
});

export default router;
