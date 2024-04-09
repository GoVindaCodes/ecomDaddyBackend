// users/user.model.ts
/* Created By: Rahul 30-11-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {

  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: number;

  @Prop()
  image: string;

  @Prop({ default: 0 })
  is_active: number;

  @Prop()
  type: string;

  @Prop()
  country: string;

  @Prop()
  zipcode: number;

  @Prop()
  social: string;

  @Prop()
  token: string;

  @Prop()
  notifications: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
