import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NfeService } from './nfe.service';

@ApiTags('NF-e')
@ApiBearerAuth()
@Controller('nfe')
@UseGuards(JwtAuthGuard)
export class NfeController {
  constructor(private readonly nfeService: NfeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Fazer upload de arquivo XML de NF-e' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo XML da NF-e'
        }
      },
      required: ['file']
    }
  })
  @ApiOkResponse({
    description: 'XML processado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        nfeId: { type: 'number' }
      }
    }
  })
  async uploadXml(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    if (!file.originalname.toLowerCase().endsWith('.xml')) {
      throw new BadRequestException('Apenas arquivos XML são permitidos');
    }

    const xmlContent = file.buffer.toString('utf-8');
    const userId = req.user.id;

    return this.nfeService.uploadNfe(xmlContent, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as NF-e do usuário' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Número da página', example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Quantidade de itens por página', example: 50 })
  @ApiOkResponse({
    description: 'Lista de NF-e retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              numeroNota: { type: 'string' },
              dataEmissao: { type: 'string' },
              valorTotal: { type: 'number' },
              emitente: { type: 'string' }
            }
          }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  listNfes(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    const userId = req.user.id;
    return this.nfeService.listNfes(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma NF-e específica' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da NF-e' })
  @ApiOkResponse({
    description: 'Detalhes da NF-e retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        numeroNota: { type: 'string' },
        dataEmissao: { type: 'string' },
        valorTotal: { type: 'number' },
        emitente: { type: 'object' },
        destinatario: { type: 'object' },
        produtos: { type: 'array' }
      }
    }
  })
  getNfeDetails(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.nfeService.getNfeDetails(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma NF-e' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da NF-e a ser deletada' })
  @ApiOkResponse({
    description: 'NF-e deletada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async deleteNfe(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.nfeService.deleteNfe(id, userId);
  }
}
