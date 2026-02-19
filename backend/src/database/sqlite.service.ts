import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';

@Injectable()
export class SqliteService implements OnModuleInit, OnModuleDestroy {
  private db: Database.Database;

  onModuleInit() {
    const dbPath = join(__dirname, '..', '..', 'prisma', 'database.sqlite');
    this.db = new Database(dbPath, { readonly: false });

    // Pragmas para máxima performance de leitura
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = -20000'); // 20MB cache
    this.db.pragma('temp_store = MEMORY');
    this.db.pragma('mmap_size = 268435456'); // 256MB mmap

    // Preparar statements para reutilização
    this.prepareStatements();
  }

  onModuleDestroy() {
    this.db?.close();
  }

  private stmtListNfes: Database.Statement;
  private stmtCountNfes: Database.Statement;
  private stmtNfeById: Database.Statement;
  private stmtNfeItems: Database.Statement;

  private prepareStatements() {
    this.stmtListNfes = this.db.prepare(`
      SELECT
        id,
        numero,
        serie,
        dataEmissao,
        emitenteNome,
        emitenteCNPJ,
        valorTotal
      FROM nfes
      WHERE userId = ?
      ORDER BY dataEmissao DESC
      LIMIT ? OFFSET ?
    `);

    this.stmtCountNfes = this.db.prepare(`
      SELECT COUNT(1) AS total FROM nfes WHERE userId = ?
    `);

    this.stmtNfeById = this.db.prepare(`
      SELECT
        id,
        chaveNFe,
        numero,
        serie,
        dataEmissao,
        emitenteNome,
        emitenteCNPJ,
        destNome,
        destCNPJ,
        valorTotal
      FROM nfes
      WHERE id = ? AND userId = ?
      LIMIT 1
    `);

    this.stmtNfeItems = this.db.prepare(`
      SELECT
        id,
        codigo,
        descricao,
        ncm,
        cfop,
        quantidade,
        valorUnitario,
        valorTotal
      FROM nfe_items
      WHERE nfeId = ?
      ORDER BY id ASC
    `);
  }

  listNfes(userId: number, page: number, limit: number) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const offset = (safePage - 1) * safeLimit;

    const nfes = this.stmtListNfes.all(userId, safeLimit, offset);
    const totalRow = this.stmtCountNfes.get(userId) as { total: number };
    const total = totalRow?.total || 0;

    return {
      data: nfes,
      total,
      page: safePage,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }

  getNfeDetails(nfeId: number, userId: number) {
    const nfe = this.stmtNfeById.get(nfeId, userId) as Record<string, any> | undefined;

    if (!nfe) {
      return null;
    }

    const items = this.stmtNfeItems.all(nfeId);

    return {
      ...nfe,
      items,
    };
  }
}
