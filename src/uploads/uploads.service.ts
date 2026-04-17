/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {}

  async handleFileUpload(files: Express.Multer.File[], folder: string = '') {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    // Obtener el host y puerto de las variables de entorno o usar valores por defecto
    const host = this.configService.get<string>('HOST', 'localhost');
    const port = this.configService.get<number>('PORT', 3000);
    const protocol = this.configService.get<string>('PROTOCOL', 'http');

    // Construir la URL base
    const baseUrl = `${protocol}://${host}:${port}`;

    // Sanitizar la carpeta
    const sanitizedFolder = folder
      ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
      : '';

    const results = [];

    for (const file of files) {
      let finalPath = file.path;
      const finalFilename = file.filename;

      // Si hay una carpeta especificada y el archivo no está ya en esa carpeta, moverlo
      if (sanitizedFolder) {
        const targetDir = path.join('./uploads', sanitizedFolder);
        const targetPath = path.join(targetDir, file.filename);

        // Solo mover si no está ya en la carpeta correcta
        if (file.path !== targetPath) {
          try {
            // Crear el directorio si no existe
            await fs.promises.mkdir(targetDir, { recursive: true });

            // Mover el archivo
            await fs.promises.rename(file.path, targetPath);

            finalPath = targetPath;
            console.log(`📁 Archivo movido a: ${targetPath}`);
          } catch (error) {
            console.error(` Error moviendo archivo a ${targetPath}:`, error);
            // Si falla el movimiento, mantener el archivo en su ubicación original
          }
        }
      }

      // Construir la ruta relativa para la URL
      const urlPath = sanitizedFolder
        ? `uploads/${sanitizedFolder}/${finalFilename}`
        : `uploads/${finalFilename}`;

      // Construir la URL completa de la imagen
      const imageUrl = `${baseUrl}/${urlPath}`;

      results.push({
        originalName: file.originalname,
        filename: finalFilename,
        mimetype: file.mimetype,
        size: file.size,
        path: finalPath,
        folder: sanitizedFolder || 'root',
        url: imageUrl,
      });
    }

    return results;
  }

  // Método adicional para obtener la URL de una imagen existente
  getFileUrl(filename: string, folder: string = ''): string {
    const host = this.configService.get<string>('HOST', 'localhost');
    const port = this.configService.get<number>('PORT', 3000);
    const protocol = this.configService.get<string>('PROTOCOL', 'http');
    
    const sanitizedFolder = folder
      ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
      : '';

    const urlPath = sanitizedFolder
      ? `uploads/${sanitizedFolder}/${filename}`
      : `uploads/${filename}`;

    return `${protocol}://${host}:${port}/${urlPath}`;
  }

  // Método para eliminar un archivo
  async deleteFile(filename: string, folder: string = ''): Promise<void> {
    const sanitizedFolder = folder
      ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
      : '';

    const filePath = sanitizedFolder
      ? path.join('./uploads', sanitizedFolder, filename)
      : path.join('./uploads', filename);
    
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw new HttpException(
        `Could not delete file: ${filename}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Método para verificar si un archivo existe
  async fileExists(filename: string, folder: string = ''): Promise<boolean> {
    const sanitizedFolder = folder
      ? folder.replace(/\.\./g, '').replace(/^\/+/, '').replace(/\/+$/, '')
      : '';

    const filePath = sanitizedFolder
      ? path.join('./uploads', sanitizedFolder, filename)
      : path.join('./uploads', filename);
    
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Método auxiliar para crear directorios si no existen
  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new HttpException(
        `Could not create directory: ${dirPath}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}