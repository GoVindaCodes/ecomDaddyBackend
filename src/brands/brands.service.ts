// categories/categories.service.ts
/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './brands.model';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>) {}

  async createBrand(brand: Brand): Promise<Brand> {    
    const { name } = brand;

    // Check if the email already exists in the database
    const existingBrand = await this.brandModel.findOne({ name }).exec();
    if (existingBrand) {
      throw new ConflictException('name already exists');
    }

    try {
      const createdBrand = new this.brandModel(brand);
      return await createdBrand.save();
    } catch (error) {
      console.error('Error creating brand:', error.message);
      throw new BadRequestException('Unable to create brand',error.message);
    }
  }

  async getAllBrands(): Promise<Brand[]> {
    try {
      return await this.brandModel.find().exec();
    } catch (error) {
      console.error('Error getting all categories:', error.message);
      throw new BadRequestException('Unable to retrieve categories',error.message);
    }
  }

  async getBrandById(id: string): Promise<Brand> {
    try {
      const brand = await this.brandModel.findById(id).exec();
      if (!brand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }
      return brand;
    } catch (error) {
      console.error('Error getting brand by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve brand',error.message);
      }
    }
  }

  async updateBrand(id: string, updatedBrand: Brand): Promise<Brand> {
    const { name } = updatedBrand;

    // Check if the email already exists in the database for other categories
    const existingBrand = await this.brandModel.findOne({ name, _id: { $ne: id } }).exec();
    if (existingBrand) {
      throw new ConflictException('Email already exists for another brand');
    }

    try {
      const brand = await this.brandModel.findByIdAndUpdate(id, updatedBrand, { new: true }).exec();
      if (!brand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }
      return brand;
    } catch (error) {
      console.error('Error updating brand:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update brand',error.message);
      }
    }
  }

  async deleteBrand(id: string): Promise<Brand> {
    try {
      const brand = await this.brandModel.findByIdAndDelete(id).exec();
      if (!brand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }
      return brand;
    } catch (error) {
      console.error('Error deleting brand:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete brand',error.message);
      }
    }
  }
}
