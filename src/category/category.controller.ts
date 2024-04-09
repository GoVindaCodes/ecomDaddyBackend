// categories/categories.controller.ts
/* Created By: Rahul 01-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch, BadRequestException, Logger } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { Category } from './category.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.getCategoryById(id);
  }

  @Post()
  async createCategory(@Body() cat: Category): Promise<Category> {
    return this.categoriesService.createCategory(cat);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() cat: Category): Promise<Category> {
    return this.categoriesService.updateCategory(id, cat);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.deleteCategory(id);
  }
  @Patch('delete/many')
  async deleteManyLanguages(@Body() ids: string[]): Promise<Category[]> {
    console.log("Received IDs:", ids);
    try {
      const updatedLanguages = await this.categoriesService.deleteManyLanguages(ids);
      return updatedLanguages;
    } catch (error) {
      throw new Error('Failed to delete languages');
    }
  }
  @Patch('update/many')
  async updateManyLanguages(@Body() body: { ids: string[], status: string }): Promise<{ message: string }> {
    try {
      const { ids, status } = body;
      await this.categoriesService.updateManyLanguages(ids, status); // Pass both ids and status to the service method
      Logger.log('Languages updated successfully');
      return { message: 'Languages updated successfully' };
    } catch (error) {
      Logger.error(`Failed to update languages: ${error.message}`);
      throw new BadRequestException(`Failed to update languages: ${error.message}`);
    }
  }
  @Put('status/:id')
  async updateStatus(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.updateStatus(id);
  }
  // @Delete('delete/many')
  // async deleteManyCategories(@Body() ids: string[]): Promise<{ message: string }> {
  //   try {
  //     await this.categoriesService.deleteManyCategories(ids);
  //     return { message: 'Categories deleted successfully' };
  //   } catch (error) {
  //     throw new Error('Failed to delete categories');
  //   }
  // }
}
