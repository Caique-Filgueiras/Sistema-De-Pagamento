import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import model from '../models/User.js';
const router = Router();

const { sign } = jsonwebtoken;

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const usuarioExistente = await model.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Usuário já existe.' });
    }

    await model.create({ nome, email, senha });
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário.', erro: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await model.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ mensagem: 'Credenciais inválidas.' });
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: 'Credenciais inválidas.' });
    }

    const token = sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ mensagem: 'Login bem-sucedido!', token });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao fazer login.', erro: err.message });
  }
});

export default router;
