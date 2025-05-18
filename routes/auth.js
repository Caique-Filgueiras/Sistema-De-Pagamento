const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro de usuário
router.post('/registrar', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ mensagem: 'Usuário já existe.' });

    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário.', erro: err.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(400).json({ mensagem: 'Credenciais inválidas.' });

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) return res.status(400).json({ mensagem: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ mensagem: 'Login bem-sucedido!', token });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao fazer login.', erro: err.message });
  }
});

module.exports = router;
