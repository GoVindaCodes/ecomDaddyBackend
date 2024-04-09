/* Created By: Rahul 01-12-2023 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Attribute extends Document {

    @Prop({ required: true })
    title: string;

    @Prop()
    name: string;

    // @Prop()
    // variants: string[]; // Change variants to an array of objects

    @Prop()
    option: string;

    // @Prop({ default: 'attribute' }) // Set type to 'attribute' by default
    // type: string;

    @Prop()
    lang: string;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
export type AttributeDocument = Attribute & Document;
