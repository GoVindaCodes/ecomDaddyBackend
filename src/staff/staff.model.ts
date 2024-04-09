// staff/staff.model.ts
/* Created By: Rahul 05-12-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Staff extends Document {

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  role_id: string;

}

export const StaffSchema = SchemaFactory.createForClass(Staff);
export type StaffDocument = Staff & Document;
