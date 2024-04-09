// mongodb.module.ts
/* Created By: Rahul 28-11-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/ecommdaddy'),
  ],
})
export class MongodbModule { }
