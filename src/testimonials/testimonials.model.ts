// testimonials/testimonials.model.ts
/* Created By: Rahul 01-12-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Testimonial extends Document {

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  designation: string;


}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
export type TestimonialDocument = Testimonial & Document;
