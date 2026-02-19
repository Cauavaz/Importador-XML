import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SqliteService } from '../database/sqlite.service';
import * as xml2js from 'xml2js';

@Injectable()
export class NfeService {
  constructor(
    private prisma: PrismaService,
    private sqlite: SqliteService,
  ) {}

  private isTransientSqliteError(error: any): boolean {
    const code = String(error?.code || '');
    const message = String(error?.message || '').toLowerCase();
    return (
      code === 'P1008' ||
      code === 'P2010' ||
      code === 'P2034' ||
      message.includes('database is locked') ||
      message.includes('failed to respond to a query within the configured timeout')
    );
  }

  private async wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryOnSqliteLock<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (!this.isTransientSqliteError(error) || attempt === maxAttempts) {
          throw error;
        }

        await this.wait(250 * attempt);
      }
    }

    throw lastError;
  }

  async parseXml(xmlContent: string): Promise<any> {
    const parser = new xml2js.Parser({ 
      explicitArray: false,
      trim: true,
      normalize: true,
      normalizeTags: false
    });
    return parser.parseStringPromise(xmlContent);
  }

  private extrairValor(obj: any, caminho: string[]): any {
    let valor = obj;
    for (const chave of caminho) {
      if (valor && typeof valor === 'object' && chave in valor) {
        valor = valor[chave];
      } else {
        return null;
      }
    }
    return valor;
  }

  private extrairArray(obj: any, caminho: string[]): any[] {
    const valor = this.extrairValor(obj, caminho);
    if (!valor) return [];
    return Array.isArray(valor) ? valor : [valor];
  }

  async uploadNfe(xmlContent: string, userId: number) {
    try {
      const parsedXml = await this.parseXml(xmlContent);
      
      // Estrutura principal do XML
      const nfe = this.extrairValor(parsedXml, ['nfeProc', 'NFe', 'infNFe']) || 
                  this.extrairValor(parsedXml, ['NFe', 'infNFe']);
      
      if (!nfe) {
        throw new BadRequestException('XML inválido: estrutura de NF-e não encontrada');
      }

      // Dados básicos da NF-e
      const ide = this.extrairValor(nfe, ['ide']);
      const emit = this.extrairValor(nfe, ['emit']);
      const dest = this.extrairValor(nfe, ['dest']);
      const total = this.extrairValor(nfe, ['total', 'ICMSTot']);
      
      // Validação de campos obrigatórios
      const numero = this.extrairValor(ide, ['nNF']);
      const serie = this.extrairValor(ide, ['serie']);
      const emitenteNome = this.extrairValor(emit, ['xNome']);
      const destNome = this.extrairValor(dest, ['xNome']);
      const valorTotal = this.extrairValor(total, ['vNF']);

      if (!numero || !serie || !emitenteNome || !destNome || !valorTotal) {
        throw new BadRequestException('XML inválido: campos obrigatórios da NF-e ausentes');
      }

      // Extrair chave da NF-e
      const chaveNFe = this.extrairValor(nfe, ['$', 'Id'])?.replace('NFe', '') || null;

      // Verificar duplicidade
      if (chaveNFe) {
        const existingNfe = await this.prisma.nFe.findFirst({
          where: { chaveNFe, userId },
          select: { id: true, numero: true, valorTotal: true },
        });

        if (existingNfe) {
          return {
            success: true,
            duplicated: true,
            message: 'NF-e já importada anteriormente',
            nfeId: existingNfe.id,
            numero: existingNfe.numero,
            valorTotal: existingNfe.valorTotal,
          };
        }
      }

      // Data de emissão
      const dataEmissaoStr = this.extrairValor(ide, ['dhEmi']) || this.extrairValor(ide, ['dEmi']);
      const dataEmissao = new Date(dataEmissaoStr);
      if (Number.isNaN(dataEmissao.getTime())) {
        throw new BadRequestException('XML inválido: data de emissão inválida');
      }

      // Criar NF-e no banco
      let nfeRecord;
      try {
        nfeRecord = await this.retryOnSqliteLock(() => this.prisma.nFe.create({
          data: {
            chaveNFe,
            numero: String(numero),
            serie: String(serie),
            dataEmissao,
            emitenteNome: String(emitenteNome),
            emitenteCNPJ: String(this.extrairValor(emit, ['CNPJ']) || this.extrairValor(emit, ['CPF']) || 'N/A'),
            destNome: String(destNome),
            destCNPJ: String(this.extrairValor(dest, ['CNPJ']) || this.extrairValor(dest, ['CPF']) || 'N/A'),
            valorTotal: parseFloat(String(valorTotal)),
            userId,
          },
          select: { id: true, numero: true, valorTotal: true },
        }));
      } catch (error: any) {
        // Tratamento específico para erro de duplicidade
        if (error.code === 'P2002') {
          console.log('🔄 Erro de constraint detectado:', error.code);
          console.log('Meta:', error.meta);
          
          // Buscar NF-e existente
          const existingNfe = await this.prisma.nFe.findFirst({
            where: { chaveNFe, userId },
            select: { id: true, numero: true, valorTotal: true },
          });

          if (existingNfe) {
            console.log('✅ NF-e duplicada encontrada:', existingNfe.numero);
            return {
              success: true,
              duplicated: true,
              message: 'NF-e já importada anteriormente',
              nfeId: existingNfe.id,
              numero: existingNfe.numero,
              valorTotal: existingNfe.valorTotal,
            };
          }
          
          // Se não encontrar com userId, buscar sem filtro
          const anyNfe = await this.prisma.nFe.findFirst({
            where: { chaveNFe },
            select: { id: true, numero: true, valorTotal: true },
          });
          
          if (anyNfe) {
            console.log('⚠️ NF-e encontrada mas de outro usuário');
            return {
              success: true,
              duplicated: true,
              message: 'NF-e já importada anteriormente',
              nfeId: anyNfe.id,
              numero: anyNfe.numero,
              valorTotal: anyNfe.valorTotal,
            };
          }
        }
        
        console.error('❌ Erro não tratado:', error.code, error.message);
        throw error;
      }

      // Processar itens
      const detArray = this.extrairArray(nfe, ['det']);
      
      if (detArray.length > 0) {
        const items = detArray.map((item: any) => {
          const prod = this.extrairValor(item, ['prod']);
          return {
            nfeId: nfeRecord.id,
            codigo: String(this.extrairValor(prod, ['cProd']) || ''),
            descricao: String(this.extrairValor(prod, ['xProd']) || ''),
            ncm: this.extrairValor(prod, ['NCM']) ? String(this.extrairValor(prod, ['NCM'])) : null,
            cfop: this.extrairValor(prod, ['CFOP']) ? String(this.extrairValor(prod, ['CFOP'])) : null,
            quantidade: parseFloat(String(this.extrairValor(prod, ['qCom']) || '0')),
            valorUnitario: parseFloat(String(this.extrairValor(prod, ['vUnCom']) || '0')),
            valorTotal: parseFloat(String(this.extrairValor(prod, ['vProd']) || '0')),
          };
        }).filter(item => item.codigo && item.descricao); // Filtrar itens válidos

        if (items.length > 0) {
          await this.retryOnSqliteLock(() => this.prisma.nFeItem.createMany({
            data: items,
          }));
        }
      }

      return {
        success: true,
        message: 'NF-e importada com sucesso',
        nfeId: nfeRecord.id,
        numero: nfeRecord.numero,
        valorTotal: nfeRecord.valorTotal,
      };
    } catch (error) {
      if (this.isTransientSqliteError(error)) {
        throw new ServiceUnavailableException(
          'Banco de dados ocupado no momento. Feche outros programas usando o SQLite e tente novamente.',
        );
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ServiceUnavailableException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(`Erro ao processar XML: ${error.message}`);
    }
  }

  listNfes(userId: number, page: number = 1, limit: number = 50) {
    return this.sqlite.listNfes(userId, Number(page) || 1, Number(limit) || 50);
  }

  getNfeDetails(nfeId: number, userId: number) {
    const result = this.sqlite.getNfeDetails(nfeId, userId);
    if (!result) {
      throw new NotFoundException('NF-e não encontrada');
    }
    return result;
  }

  async deleteNfe(nfeId: number, userId: number) {
    const nfe = await this.prisma.nFe.findFirst({
      where: { id: nfeId, userId },
      select: { id: true, numero: true },
    });

    if (!nfe) {
      throw new NotFoundException('NF-e não encontrada');
    }

    await this.prisma.nFe.delete({
      where: { id: nfeId },
    });

    return {
      success: true,
      message: `NF-e ${nfe.numero} excluída com sucesso`,
    };
  }
}
