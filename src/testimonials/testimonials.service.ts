// testimonials/testimonials.service.ts
/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './testimonials.model';

@Injectable()
export class TestimonialsService {
  constructor(@InjectModel(Testimonial.name) private readonly categoryModel: Model<TestimonialDocument>) {}

  async createTestimonial(category: Testimonial): Promise<Testimonial> {    
    const { name } = category;

    // Check if the email already exists in the database
    const existingTestimonial = await this.categoryModel.findOne({ name }).exec();
    if (existingTestimonial) {
      throw new ConflictException('name already exists');
    }

    try {
      const createdTestimonial = new this.categoryModel(category);
      return await createdTestimonial.save();
    } catch (error) {
      console.error('Error creating category:', error.message);
      throw new BadRequestException('Unable to create category',error.message);
    }
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      console.error('Error getting all testimonials:', error.message);
      throw new BadRequestException('Unable to retrieve testimonials',error.message);
    }
  }

  async getTestimonialById(id: string): Promise<Testimonial> {
    try {
      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        throw new NotFoundException(`Testimonial with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error('Error getting category by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve category',error.message);
      }
    }
  }

  async updateTestimonial(id: string, updatedTestimonial: Testimonial): Promise<Testimonial> {
    const { name } = updatedTestimonial;

    // Check if the email already exists in the database for other testimonials
    const existingTestimonial = await this.categoryModel.findOne({ name, _id: { $ne: id } }).exec();
    if (existingTestimonial) {
      throw new ConflictException('Email already exists for another category');
    }

    try {
      const category = await this.categoryModel.findByIdAndUpdate(id, updatedTestimonial, { new: true }).exec();
      if (!category) {
        throw new NotFoundException(`Testimonial with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error('Error updating category:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update category',error.message);
      }
    }
  }

  async deleteTestimonial(id: string): Promise<Testimonial> {
    try {
      const category = await this.categoryModel.findByIdAndDelete(id).exec();
      if (!category) {
        throw new NotFoundException(`Testimonial with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error('Error deleting category:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete category',error.message);
      }
    }
  }
}
