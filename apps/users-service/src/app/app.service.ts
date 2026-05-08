import { shared } from '@mi-app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getData(): Promise<{ message: string; }> {
    return await shared();
    // return { message: 'Hello API' };
  }
}
