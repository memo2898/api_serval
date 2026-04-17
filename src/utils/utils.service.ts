import { Injectable } from '@nestjs/common';


@Injectable()
export class UtilsService {
  constructor(
  ) {}

  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
    };
  }

}
