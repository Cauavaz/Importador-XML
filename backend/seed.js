import { sequelize, User } from './database.js';

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    
    // Criar usuários iniciais
    const users = [
      {
        username: 'cauavaz1@gmail.com',
        passwordHash: '12345678',
        role: 'admin'
      },
      {
        username: 'felipe',
        passwordHash: '12345678',
        role: 'user'
      }
    ];
    
    for (const userData of users) {
      await User.create(userData);
      console.log(`Usuário ${userData.username} criado com sucesso`);
    }
    
    console.log('Banco de dados populado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
    process.exit(1);
  }
}

seedDatabase();
