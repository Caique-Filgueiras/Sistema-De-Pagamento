import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './database/config.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

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
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } else {
    process.exit(1);
  }
})();
