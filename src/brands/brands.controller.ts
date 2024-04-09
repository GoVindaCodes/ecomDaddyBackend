// brands/brands.controller.ts
/* Created By: Rahul 01-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './brands.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBrands(): Promise<Brand[]> {
    return this.brandsService.getAllBrands();
  }

  @Get(':id')
  async getBrandById(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.getBrandById(id);
  }

  @Post()
  async createBrand(@Body() brand: Brand): Promise<Brand> {
    return this.brandsService.createBrand(brand);
  }

  @Put(':id')
  async updateBrand(@Param('id') id: string, @Body() brand: Brand): Promise<Brand> {
    return this.brandsService.updateBrand(id, brand);
  }

  @Delete(':id')
  async deleteBrand(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.deleteBrand(id);
  }
}
