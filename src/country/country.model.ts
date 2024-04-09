// country/country.model.ts
/* Created By: Rahul 01-12-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Country extends Document {

  @Prop({ required: true })
  country_code: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  language_id: number;

  @Prop()
  currency_id: number;

}

export const CountrySchema = SchemaFactory.createForClass(Country);
export type CountryDocument = Country & Document;
