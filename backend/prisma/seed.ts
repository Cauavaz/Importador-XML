import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.nFeItem.deleteMany();
  await prisma.nFe.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Dados antigos removidos');

  // Criar usuário de demonstração
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('demo123', salt);

  const user = await prisma.user.create({
    data: {
      username: 'demo@importador.com',
      password: hashedPassword,
      salt: salt,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Usuário de demonstração criado');
  console.log('   Email: demo@importador.com');
  console.log('   Senha: demo123');

  // Criar NF-e de exemplo
  const nfe1 = await prisma.nFe.create({
    data: {
      chaveNFe: '35260290969751000103550050012327681511568420',
      numero: '1232768',
      serie: '5',
      dataEmissao: new Date('2026-02-11T14:31:00-03:00'),
      emitenteNome: 'DISTRIBUIDORA ALIMENTOS LTDA',
      emitenteCNPJ: '90969751000103',
      destNome: 'SUPERMERCADO I-SINC LTDA',
      destCNPJ: '09285242000143',
      valorTotal: 2215.00,
      userId: user.id,
    },
  });

  console.log('✅ NF-e de exemplo criada');

  // Criar itens da NF-e
  await prisma.nFeItem.createMany({
    data: [
      {
        nfeId: nfe1.id,
        codigo: '000142',
        descricao: 'ARROZ PROVINCIAS DO SUL 15/2',
        ncm: '10063021',
        cfop: '5101',
        quantidade: 5.0,
        valorUnitario: 133.0,
        valorTotal: 665.0,
      },
      {
        nfeId: nfe1.id,
        codigo: '000019',
        descricao: 'ARROZ BEN.SOLITO LF T1 30/1',
        ncm: '10063021',
        cfop: '5101',
        quantidade: 10.0,
        valorUnitario: 89.0,
        valorTotal: 890.0,
      },
      {
        nfeId: nfe1.id,
        codigo: '000106',
        descricao: 'ARROZ BEN.SOLITO P. INTEGRAL T1 30/1',
        ncm: '10062010',
        cfop: '5101',
        quantidade: 6.0,
        valorUnitario: 110.0,
        valorTotal: 660.0,
      },
    ],
  });

  console.log('✅ 3 itens criados para a NF-e');

  // Criar segunda NF-e
  const nfe2 = await prisma.nFe.create({
    data: {
      chaveNFe: '35260290969751000103550050012327691511568421',
      numero: '1232769',
      serie: '5',
      dataEmissao: new Date('2026-02-12T10:15:00-03:00'),
      emitenteNome: 'DISTRIBUIDORA ALIMENTOS LTDA',
      emitenteCNPJ: '90969751000103',
      destNome: 'MERCADO BOM PREÇO LTDA',
      destCNPJ: '12345678000190',
      valorTotal: 1850.00,
      userId: user.id,
    },
  });

  await prisma.nFeItem.createMany({
    data: [
      {
        nfeId: nfe2.id,
        codigo: '000200',
        descricao: 'FEIJÃO PRETO TIPO 1 30/1',
        ncm: '07133310',
        cfop: '5101',
        quantidade: 15.0,
        valorUnitario: 85.0,
        valorTotal: 1275.0,
      },
      {
        nfeId: nfe2.id,
        codigo: '000201',
        descricao: 'AÇÚCAR CRISTAL 30/1',
        ncm: '17011100',
        cfop: '5101',
        quantidade: 10.0,
        valorUnitario: 57.5,
        valorTotal: 575.0,
      },
    ],
  });

  console.log('✅ Segunda NF-e criada com 2 itens');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log('   - 1 usuário criado');
  console.log('   - 2 NF-es criadas');
  console.log('   - 5 itens criados');
  console.log('\n🔐 Credenciais de acesso:');
  console.log('   Email: demo@importador.com');
  console.log('   Senha: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
