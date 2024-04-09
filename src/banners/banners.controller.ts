/* eslint-disable prettier/prettier */
// banners/banners.controller.ts
// /* Created By: Rahul 01-12-2023 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { Banner } from './banners.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBanners(): Promise<Banner[]> {
    return this.bannersService.getAllBanners();
  }

  @Get(':id')
  async getBannerById(@Param('id') id: string): Promise<Banner> {
    return this.bannersService.getBannerById(id);
  }

  @Post()
  async createBanner(@Body() cat: Banner): Promise<Banner> {
    return this.bannersService.createBanner(cat);
  }

  @Put(':id')
  async updateBanner(
    @Param('id') id: string,
    @Body() cat: Banner,
  ): Promise<Banner> {
    return this.bannersService.updateBanner(id, cat);
  }

  @Delete(':id')
  async deleteBanner(@Param('id') id: string): Promise<Banner> {
    return this.bannersService.deleteBanner(id);
  }
}
