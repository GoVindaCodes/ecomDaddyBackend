// banners/banners.module.ts
/* Created By: Rahul 01-12-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { Banner, BannerSchema } from './banners.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }])],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
