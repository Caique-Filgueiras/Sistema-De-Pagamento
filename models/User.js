import { DataTypes } from 'sequelize';
import { compare, genSalt, hash } from 'bcryptjs';
import sequelize from '../database/config.js';

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeSave: async (user, options) => {
      if (user.changed('senha')) {
        const salt = await genSalt(10);
        user.senha = await hash(user.senha, salt);
      }
    }
  }
});

User.prototype.compararSenha = function (senha) {
  return compare(senha, this.senha);
};

export default User;
