import { sequelize, User } from './database.js';

async function viewDatabase() {
  try {
    console.log('=== USUÁRIOS CADASTRADOS ===\n');
    
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'tokenDataCriacao', 'createdAt']
    });
    
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Usuário: ${user.username}`);
      console.log(`Cargo: ${user.role}`);
      console.log(`Token criado em: ${user.tokenDataCriacao || 'N/A'}`);
      console.log(`Criado em: ${user.createdAt}`);
      console.log('---');
    });
    
    console.log(`\nTotal de usuários: ${users.length}`);
    
    await sequelize.close();
  } catch (error) {
    console.error('Erro ao consultar banco:', error);
  }
}

viewDatabase();
