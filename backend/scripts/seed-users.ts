import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando usuários iniciais...\n');

  // Limpar usuários existentes (opcional)
  // await prisma.user.deleteMany();

  // Criar usuário admin
  const adminSalt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('12345678', adminSalt);

  const admin = await prisma.user.upsert({
    where: { username: 'cauavaz1@gmail.com' },
    update: {},
    create: {
      username: 'cauavaz1@gmail.com',
      password: adminPassword,
      salt: adminSalt,
      role: 'admin',
    },
  });

  console.log('✅ Admin criado:');
  console.log('   Email: cauavaz1@gmail.com');
  console.log('   Senha: 12345678');
  console.log('   Role: admin\n');

  // Criar usuário normal
  const userSalt = await bcrypt.genSalt(10);
  const userPassword = await bcrypt.hash('12345678', userSalt);

  const user = await prisma.user.upsert({
    where: { username: 'felipe@email.com' },
    update: {},
    create: {
      username: 'felipe@email.com',
      password: userPassword,
      salt: userSalt,
      role: 'user',
    },
  });

  console.log('✅ Usuário criado:');
  console.log('   Email: felipe@email.com');
  console.log('   Senha: 12345678');
  console.log('   Role: user\n');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📊 Total de usuários no banco:', await prisma.user.count());
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
