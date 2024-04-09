// roles/role.model.ts
/* Created By: Rahul 05-12-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {

  @Prop({ required: true })
  role_name: string;

  @Prop()
  access: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
export type RoleDocument = Role & Document;
