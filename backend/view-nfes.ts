import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 === VISUALIZANDO DADOS DAS NF-es ===\n');

  // Contar registros
  const nfesCount = await prisma.nFe.count();
  const itemsCount = await prisma.nFeItem.count();

  console.log(`Total de NF-es: ${nfesCount}`);
  console.log(`Total de Itens: ${itemsCount}\n`);

  if (nfesCount === 0) {
    console.log('❌ Nenhuma NF-e encontrada no banco!');
    console.log('   Faça upload de arquivos XML para importar notas.\n');
    return;
  }

  // Listar NF-es
  const nfes = await prisma.nFe.findMany({
    take: 10,
    orderBy: { dataEmissao: 'desc' },
    include: {
      items: true,
    },
  });

  console.log('=== ÚLTIMAS 10 NF-es ===\n');

  for (const nfe of nfes) {
    console.log(`📋 NF-e #${nfe.id}`);
    console.log(`   Número: ${nfe.numero} | Série: ${nfe.serie}`);
    console.log(`   Emitente: ${nfe.emitenteNome} (${nfe.emitenteCNPJ})`);
    console.log(`   Destinatário: ${nfe.destNome}`);
    console.log(`   Data: ${nfe.dataEmissao.toLocaleDateString('pt-BR')}`);
    console.log(`   Valor Total: R$ ${nfe.valorTotal.toFixed(2)}`);
    console.log(`   Itens: ${nfe.items.length} produtos`);
    console.log(`   Chave: ${nfe.chaveNFe || 'N/A'}`);
    console.log('');
  }

  console.log('✅ Dados carregados com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
