// app/app.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, this is the main route!';
  }
  getHelloe(): string {
    return 'just checking!!!!!!';
  }
}
