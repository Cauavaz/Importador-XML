import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    await this.tryQueryRaw('PRAGMA journal_mode = WAL');
    await this.tryQueryRaw('PRAGMA busy_timeout = 10000');
    await this.tryExecuteRaw(
      'CREATE INDEX IF NOT EXISTS idx_nfes_userId_dataEmissao ON nfes(userId, dataEmissao DESC)',
    );
    await this.tryExecuteRaw('CREATE INDEX IF NOT EXISTS idx_nfe_items_nfeId ON nfe_items(nfeId)');

    const clearNfesOnBoot =
      String(this.configService.get('CLEAR_NFES_ON_BOOT') || 'false').toLowerCase() === 'true';

    if (clearNfesOnBoot) {
      await this.tryExecuteRaw('DELETE FROM nfe_items');
      await this.tryExecuteRaw('DELETE FROM nfes');
      console.log('🧹 NF-es removidas no startup (CLEAR_NFES_ON_BOOT=true)');
    }

    console.log('✅ Prisma conectado ao banco de dados');
  }

  private async tryQueryRaw(sql: string): Promise<void> {
    try {
      await this.$queryRawUnsafe(sql);
    } catch (error) {
      console.warn(`⚠️ Não foi possível executar SQL de inicialização: ${sql}`, (error as Error).message);
    }
  }

  private async tryExecuteRaw(sql: string): Promise<void> {
    try {
      await this.$executeRawUnsafe(sql);
    } catch (error) {
      console.warn(`⚠️ Não foi possível executar SQL de inicialização: ${sql}`, (error as Error).message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
