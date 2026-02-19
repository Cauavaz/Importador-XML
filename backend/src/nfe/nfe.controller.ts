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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NfeService } from './nfe.service';

@Controller('nfe')
@UseGuards(JwtAuthGuard)
export class NfeController {
  constructor(private readonly nfeService: NfeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
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
  listNfes(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    const userId = req.user.id;
    return this.nfeService.listNfes(userId, page, limit);
  }

  @Get(':id')
  getNfeDetails(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.nfeService.getNfeDetails(id, userId);
  }

  @Delete(':id')
  async deleteNfe(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.nfeService.deleteNfe(id, userId);
  }
}
