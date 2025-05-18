import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import model from '../models/User.js';

const router = Router();
const { sign } = jsonwebtoken;

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios.',
      redirect: '/register'
    });
  }

  try {
    const usuarioExistente = await model.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: 'Usuário já existe.',
        redirect: '/login'
      });
    }

    const novoUsuario = await model.create({ nome, email, senha });

    const token = sign({ id: novoUsuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.status(201).json({
      mensagem: 'Usuário registrado com sucesso!',
      redirect: '/payment'
    });

  } catch (err) {
    res.status(500).json({
      mensagem: 'Erro ao registrar usuário.',
      erro: err.message,
      redirect: '/register'
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: 'Email e senha são obrigatórios.',
      redirect: '/login'
    });
  }

  try {
    const usuario = await model.findOne({ where: { email } });

    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({
        mensagem: 'Credenciais inválidas.',
        redirect: '/login'
      });
    }

    const token = sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      redirect: '/payment'
    });
  } catch (err) {
    res.status(500).json({
      mensagem: 'Erro interno ao fazer login.',
      erro: err.message,
      redirect: '/login'
    });
  }
});



export default router;
