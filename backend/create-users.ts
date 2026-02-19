import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando usuários no banco...\n');

  // Criar usuário admin
  const adminSalt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('12345678', adminSalt);

  const admin = await prisma.user.create({
    data: {
      username: 'cauavaz1@gmail.com',
      password: adminPassword,
      salt: adminSalt,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Admin criado:');
  console.log('   Email: cauavaz1@gmail.com');
  console.log('   Senha: 12345678');
  console.log('   ID:', admin.id);
  console.log();

  // Criar usuário normal
  const userSalt = await bcrypt.genSalt(10);
  const userPassword = await bcrypt.hash('12345678', userSalt);

  const user = await prisma.user.create({
    data: {
      username: 'felipe@email.com',
      password: userPassword,
      salt: userSalt,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Usuário criado:');
  console.log('   Email: felipe@email.com');
  console.log('   Senha: 12345678');
  console.log('   ID:', user.id);
  console.log();

  console.log('🎉 Usuários criados com sucesso!');
  console.log('📊 Total:', await prisma.user.count());
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
