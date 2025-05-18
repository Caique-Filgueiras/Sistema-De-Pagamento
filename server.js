import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import sequelize from './database/config.js';
import { privatePage } from './middlewares/private-page.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';

// JWT
import jwt from 'jsonwebtoken';
const { verify } = jwt

// Paths
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public/css'));

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    verify(token, process.env.JWT_SECRET);
    return res.redirect('/payment');
  } catch {
    return res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    res.sendFile(path.resolve(__dirname, 'public/login.html'));
  }

  try {
    verify(token, process.env.JWT_SECRET);
    return res.redirect('/payment');
  } catch {
    res.sendFile(path.resolve(__dirname, 'public/login.html'));
  }  
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

app.get('/payment', privatePage, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/private/payment.html'));
});

async function conectarComRetry(tentativas = 10, delay = 1000) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      await sequelize.authenticate();
      console.log(`Conectado ao banco na tentativa ${i}`);
      return true;
    } catch (err) {
      console.warn(`Tentativa ${i} falhou: ${err.message}`);
      if (i < tentativas) {
        await new Promise(resolve => setTimeout(resolve, delay * i));
      } else {
        console.error('Não foi possível conectar ao banco após várias tentativas.');
        return false;
      }
    }
  }
}

(async () => {
  const conectado = await conectarComRetry();
  if (conectado) {
    await sequelize.sync();

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } else {
    process.exit(1);
  }
})();
