// languages/languages.module.ts
/* Created By: Rahul 01-12-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import { Language, LanguageSchema } from './languages.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Language.name, schema: LanguageSchema }])],
  controllers: [LanguagesController],
  providers: [LanguagesService],
})
export class LanguagesModule {}
