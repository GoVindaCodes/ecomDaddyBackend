// languages/languages.controller.ts
/* Created By: Rahul 01-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch, BadRequestException, Logger } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { Language } from './languages.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllLanguages(): Promise<Language[]> {
    return this.languagesService.getAllLanguages();
  }

  @Get(':id')
  async getLanguageById(@Param('id') id: string): Promise<Language> {
    return this.languagesService.getLanguageById(id);
  }

  @Post()
  async createLanguage(@Body() lang: Language): Promise<Language> {
    return this.languagesService.createLanguage(lang);
  }

  @Put(':id')
  async updateLanguage(@Param('id') id: string, @Body() lang: Language): Promise<Language> {
    return this.languagesService.updateLanguage(id, lang);
  }

  @Delete(':id')
  async deleteLanguage(@Param('id') id: string): Promise<Language> {
    return this.languagesService.deleteLanguage(id);
  }

  @Delete('delete/many')
  async deleteManyLanguages(@Body() ids: string[]): Promise<Language[]> {
    console.log("Received IDs:", ids);
    try {
      const updatedLanguages = await this.languagesService.deleteManyLanguages(ids);
      return updatedLanguages;
    } catch (error) {
      throw new Error('Failed to delete languages');
    }
  }

  @Patch('update/many')
  async updateManyLanguages(@Body() body: { ids: string[], status: string }): Promise<{ message: string }> {
    try {
      const { ids, status } = body;
      await this.languagesService.updateManyLanguages(ids, status); // Pass both ids and status to the service method
      Logger.log('Languages updated successfully');
      return { message: 'Languages updated successfully' };
    } catch (error) {
      Logger.error(`Failed to update languages: ${error.message}`);
      throw new BadRequestException(`Failed to update languages: ${error.message}`);
    }
  }

  @Put('status/:id')
  async updateStatus(@Param('id') id: string): Promise<Language> {
    return this.languagesService.updateStatus(id);
  }



  // @Put('status/:id')
  // async updateStatus(@Body() body: { ids: string[], status: string }): Promise<{ message: string }> {
  //   try {
  //     const { ids, status } = body;
  //     Logger.log("ids :", ids)
  //     Logger.log("status :", status)
  //     await this.languagesService.updateStatus(ids, status); // Pass both ids and status to the service method
  //     Logger.log('Languages updated Statuses', ids);
  //     return { message: 'Languages Status has been updated successfully' };
  //   } catch (error) {
  //     Logger.error(`Failed to update languages: ${error.message}`);
  //     throw new BadRequestException(`Failed to update languages: ${error.message}`);
  //   }
  // }

}
