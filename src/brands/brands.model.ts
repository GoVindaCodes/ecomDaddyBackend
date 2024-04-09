// brands/brands.model.ts
/* Created By: Rahul 01-12-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Brand extends Document {

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  slug: string;

  @Prop()
  meta_title: string;

  @Prop()
  meta_description: string;

  @Prop()
  meta_keywords: string;

  @Prop()
  og_image: string;


}

export const BrandSchema = SchemaFactory.createForClass(Brand);
export type BrandDocument = Brand & Document;
