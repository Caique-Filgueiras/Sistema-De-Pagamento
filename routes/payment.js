import { Router } from 'express';
const router = Router();
import model from '../models/payment.js';

router.post('/', async (req, res) => {
  const { tipo, dados } = req.body;

  if (!tipo || !dados) {
    return res.status(400).send({ message: 'Dados inválidos.' });
  }

  try {
    await model.create({ tipo, dados });
    res.status(201).send({ message: 'Pagamento realizado com sucesso!' });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao processar o pagamento.', error: err.message });
  }
});

export default router;
