import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const Payment = sequelize.define('Payment', {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dados: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

export default Payment;