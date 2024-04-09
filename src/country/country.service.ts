// categories/categories.service.ts
/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './country.model';

@Injectable()
export class CountriesService {
  constructor(@InjectModel(Country.name) private readonly countryModel: Model<CountryDocument>) {}

  async createCountry(country: Country): Promise<Country> {    
    const { country_code } = country;

    // Check if the email already exists in the database
    const existingCountry = await this.countryModel.findOne({ country_code }).exec();
    if (existingCountry) {
      throw new ConflictException('country_code already exists');
    }

    try {
      const createdCountry = new this.countryModel(country);
      return await createdCountry.save();
    } catch (error) {
      console.error('Error creating country:', error.message);
      throw new BadRequestException('Unable to create country',error.message);
    }
  }

  async getAllCountries(): Promise<Country[]> {
    try {
      return await this.countryModel.find().exec();
    } catch (error) {
      console.error('Error getting all categories:', error.message);
      throw new BadRequestException('Unable to retrieve categories',error.message);
    }
  }

  async getCountryById(id: string): Promise<Country> {
    try {
      const country = await this.countryModel.findById(id).exec();
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found`);
      }
      return country;
    } catch (error) {
      console.error('Error getting country by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve country',error.message);
      }
    }
  }

  async updateCountry(id: string, updatedCountry: Country): Promise<Country> {
    const { country_code } = updatedCountry;

    // Check if the email already exists in the database for other categories
    const existingCountry = await this.countryModel.findOne({ country_code, _id: { $ne: id } }).exec();
    if (existingCountry) {
      throw new ConflictException('Email already exists for another country');
    }

    try {
      const country = await this.countryModel.findByIdAndUpdate(id, updatedCountry, { new: true }).exec();
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found`);
      }
      return country;
    } catch (error) {
      console.error('Error updating country:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update country',error.message);
      }
    }
  }

  async deleteCountry(id: string): Promise<Country> {
    try {
      const country = await this.countryModel.findByIdAndDelete(id).exec();
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found`);
      }
      return country;
    } catch (error) {
      console.error('Error deleting country:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete country',error.message);
      }
    }
  }
}
