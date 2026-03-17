import {
  Controller, Post, UploadedFiles, UseGuards, UseInterceptors, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator, Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ListingsService } from '../listings/listings.service';

@ApiTags('Files')
@Controller('files')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class FilesController {
  constructor(
    private filesService: FilesService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 20))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await Promise.all(
      files.map((f) => this.filesService.uploadImage(f.buffer, f.mimetype)),
    );
    return { urls };
  }
}
