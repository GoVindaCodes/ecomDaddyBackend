// banners/banners.model.ts
/* Created By: Rahul 01-12-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Banner extends Document {

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  link: string;

  @Prop({default:1})
  status: string;

  @Prop()
  type: string;

  @Prop()
  role: string;

}

export const BannerSchema = SchemaFactory.createForClass(Banner);
export type BannerDocument = Banner & Document;
