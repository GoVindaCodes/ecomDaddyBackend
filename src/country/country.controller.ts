// country/country.controller.ts
/* Created By: Rahul 01-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CountriesService } from './country.service';
import { Country } from './country.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCountries(): Promise<Country[]> {
    return this.countriesService.getAllCountries();
  }

  @Get(':id')
  async getCountryById(@Param('id') id: string): Promise<Country> {
    return this.countriesService.getCountryById(id);
  }

  @Post()
  async createCountry(@Body() cat: Country): Promise<Country> {
    return this.countriesService.createCountry(cat);
  }

  @Put(':id')
  async updateCountry(@Param('id') id: string, @Body() cat: Country): Promise<Country> {
    return this.countriesService.updateCountry(id, cat);
  }

  @Delete(':id')
  async deleteCountry(@Param('id') id: string): Promise<Country> {
    return this.countriesService.deleteCountry(id);
  }
}
