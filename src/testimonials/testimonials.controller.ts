// testimonials/testimonials.controller.ts
/* Created By: Rahul 01-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from './testimonials.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTestimonials(): Promise<Testimonial[]> {
    return this.testimonialsService.getAllTestimonials();
  }

  @Get(':id')
  async getTestimonialById(@Param('id') id: string): Promise<Testimonial> {
    return this.testimonialsService.getTestimonialById(id);
  }

  @Post()
  async createTestimonial(@Body() testi: Testimonial): Promise<Testimonial> {
    return this.testimonialsService.createTestimonial(testi);
  }

  @Put(':id')
  async updateTestimonial(@Param('id') id: string, @Body() testi: Testimonial): Promise<Testimonial> {
    return this.testimonialsService.updateTestimonial(id, testi);
  }

  @Delete(':id')
  async deleteTestimonial(@Param('id') id: string): Promise<Testimonial> {
    return this.testimonialsService.deleteTestimonial(id);
  }
}
