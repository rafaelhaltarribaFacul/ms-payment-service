import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatusServer(): string {
    return 'running server';
  }
}
