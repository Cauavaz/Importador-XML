import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'SenhaHash'
  },
  passwordSalt: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'SenhaSalt'
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
    field: 'Cargo'
  },
  tokenDataCriacao: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'TokenDataCriacao'
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

User.beforeCreate(async (user) => {
  if (!user.passwordSalt) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.passwordHash, salt);
    user.passwordSalt = salt;
    user.passwordHash = hash;
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.passwordHash, salt);
    user.passwordSalt = salt;
    user.passwordHash = hash;
  }
});

User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

export { sequelize, User };
