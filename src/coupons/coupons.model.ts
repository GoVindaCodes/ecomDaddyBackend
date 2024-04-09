// coupons/coupons.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Coupon extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    couponCode: string;

    @Prop({ required: true })
    endTime: Date;

    @Prop({ required: true })
    discountPercentage: number;

    @Prop({ required: true })
    minimumAmount: number;

    @Prop()
    productType: string;

    @Prop()
    logo: string;

    @Prop() // Adding status field with default value 'active'
    status: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
export type CouponDocument = Coupon & Document;
