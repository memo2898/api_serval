/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';

// Filtro para validar tipos de archivo de imagen
const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  cb(null, true);
};

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('files')
  @ApiOperation({ 
    summary: 'Upload multiple files',
    description: 'Upload multiple files with optional folder organization. Example folders: "images/users", "documents/2024/january"'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        folder: {
          type: 'string',
          description: 'Optional folder path (e.g., "images/users" or "documents/2024")',
          example: 'images/users',
        },
      },
      required: ['files'],
    },
  })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req: any, file, cb) => {
          // Obtener folder del body
          const folder = req.body?.folder || '';
          
          // Sanitizar la carpeta
          const sanitizedFolder = folder
            ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
            : '';
          
          // Crear ruta completa
          const uploadPath = sanitizedFolder
            ? path.join('./uploads', sanitizedFolder)
            : './uploads';

          // Crear directorios recursivamente si no existen
          try {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(`📁 Carpeta creada/verificada: ${uploadPath}`);
          } catch (error) {
            console.error(` Error creando carpeta: ${uploadPath}`, error);
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
          cb(null, `${uniqueSuffix}-${name}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB límite por archivo
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const sanitizedFolder = folder
      ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
      : '';

    const processedFiles = await this.uploadsService.handleFileUpload(files, sanitizedFolder);

    return {
      success: true,
      message: 'Files uploaded successfully',
      count: processedFiles.length,
      folder: sanitizedFolder || 'root',
      files: processedFiles,
    };
  }

  @Post('image')
  @ApiOperation({ 
    summary: 'Upload single image',
    description: 'Upload a single image file with optional folder organization. Only accepts jpg, jpeg, png, gif, webp formats.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          description: 'Optional folder path (e.g., "avatars" or "products/images")',
          example: 'avatars',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req: any, file, cb) => {
          const folder = req.body?.folder || '';
          
          const sanitizedFolder = folder
            ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
            : '';
          
          const uploadPath = sanitizedFolder
            ? path.join('./uploads', sanitizedFolder)
            : './uploads';

          try {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(`📁 Carpeta creada/verificada: ${uploadPath}`);
          } catch (error) {
            console.error(` Error creando carpeta: ${uploadPath}`, error);
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
          cb(null, `${uniqueSuffix}-${name}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image uploaded');
    }

    const sanitizedFolder = folder
      ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
      : '';

    const processedFiles = await this.uploadsService.handleFileUpload(files, sanitizedFolder);

    return {
      success: true,
      message: 'Image uploaded successfully',
      folder: sanitizedFolder || 'root',
      image: processedFiles[0],
    };
  }

  @Get('*')
  @ApiOperation({ summary: 'Get file URL by path (supports nested folders)' })
  async getFileByPath(@Param('0') filePath: string) {
    const pathParts = filePath.split('/');
    const filename = pathParts.pop() || '';
    const folder = pathParts.join('/');

    const exists = await this.uploadsService.fileExists(filename, folder);

    if (!exists) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      url: this.uploadsService.getFileUrl(filename, folder),
      path: folder ? `${folder}/${filename}` : filename,
    };
  }

  @Delete('*')
  @ApiOperation({ summary: 'Delete a file by path (supports nested folders)' })
  async deleteFileByPath(@Param('0') filePath: string) {
    const pathParts = filePath.split('/');
    const filename = pathParts.pop() || '';
    const folder = pathParts.join('/');

    await this.uploadsService.deleteFile(filename, folder);

    return {
      success: true,
      message: 'File deleted successfully',
      path: folder ? `${folder}/${filename}` : filename,
    };
  }
}