// banners/banners.service.ts
/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './banners.model';

@Injectable()
export class BannersService {
  constructor(@InjectModel(Banner.name) private readonly bannerModel: Model<BannerDocument>) {}

  async createBanner(banner: Banner): Promise<Banner> {    
    const { title } = banner;

    // Check if the email already exists in the database
    const existingBanner = await this.bannerModel.findOne({ title }).exec();
    if (existingBanner) {
      throw new ConflictException('title already exists');
    }

    try {
      const createdBanner = new this.bannerModel(banner);
      return await createdBanner.save();
    } catch (error) {
      console.error('Error creating banner:', error.message);
      throw new BadRequestException('Unable to create banner',error.message);
    }
  }

  async getAllBanners(): Promise<Banner[]> {
    try {
      return await this.bannerModel.find().exec();
    } catch (error) {
      console.error('Error getting all banners:', error.message);
      throw new BadRequestException('Unable to retrieve banners',error.message);
    }
  }

  async getBannerById(id: string): Promise<Banner> {
    try {
      const banner = await this.bannerModel.findById(id).exec();
      if (!banner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
      return banner;
    } catch (error) {
      console.error('Error getting banner by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve banner',error.message);
      }
    }
  }

  async updateBanner(id: string, updatedBanner: Banner): Promise<Banner> {
    const { title } = updatedBanner;

    // Check if the email already exists in the database for other banners
    const existingBanner = await this.bannerModel.findOne({ title, _id: { $ne: id } }).exec();
    if (existingBanner) {
      throw new ConflictException('title already exists for another banner');
    }

    try {
      const banner = await this.bannerModel.findByIdAndUpdate(id, updatedBanner, { new: true }).exec();
      if (!banner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
      return banner;
    } catch (error) {
      console.error('Error updating banner:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update banner',error.message);
      }
    }
  }

  async deleteBanner(id: string): Promise<Banner> {
    try {
      const banner = await this.bannerModel.findByIdAndDelete(id).exec();
      if (!banner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
      return banner;
    } catch (error) {
      console.error('Error deleting banner:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete banner',error.message);
      }
    }
  }
}
