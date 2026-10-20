import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { DocumentsManager } from '../../Managers/documents-manager';
import {
  UploadDocumentInput,
  DocumentQuery,
  DocumentView,
  DocumentList,
} from '../Contracts/document.contract';
import { ListQuery } from '../Contracts/common.contract';
import type { AuthRequest } from '../Infrastructure/transport';
const binary = Object.fromEntries(
  ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'].map((type) => [
    type,
    { schema: { type: 'string' as const, format: 'binary' } },
  ]),
);
@Controller('documents')
@ApiCookieAuth()
export class DocumentsLogic {
  constructor(private documents: DocumentsManager) {}
  @Get()
  @ApiOperation({ operationId: 'listDocuments' })
  @ApiOkResponse({ type: DocumentList })
  list(@Req() req: AuthRequest, @Query() query: DocumentQuery) {
    return this.documents.list(req.actor, query);
  }
  @Post()
  @ApiOperation({ operationId: 'uploadDocument' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadDocumentInput })
  @ApiCreatedResponse({ type: DocumentView })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10485760, files: 1, fields: 8, fieldSize: 4096 },
    }),
  )
  upload(
    @Req() req: AuthRequest,
    @Body() body: UploadDocumentInput,
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string } | undefined,
  ) {
    if (!file) throw new BadRequestException('Choose a file');
    return this.documents.upload(req.actor, body, {
      bytes: file.buffer,
      mime_type: file.mimetype,
      file_name: file.originalname,
    });
  }
  @Get(':id/content')
  @ApiOperation({ operationId: 'downloadDocument' })
  @ApiResponse({ status: 200, description: 'Original file bytes', content: binary })
  async download(@Req() req: AuthRequest, @Param('id') id: string, @Res() res: Response) {
    const doc = await this.documents.download(req.actor, id);
    res.setHeader('Content-Type', doc.mime_type);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(doc.file_name)}`,
    );
    res.setHeader('Content-Length', String(doc.size_bytes));
    res.send(Buffer.from(doc.bytes));
  }
}
