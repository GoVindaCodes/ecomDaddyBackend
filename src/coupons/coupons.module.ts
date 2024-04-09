// coupons/coupons.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponsController } from './coupons.controller'; // Assuming you have a controller named CouponsController
import { CouponsService } from './coupons.service'; // Assuming you have a service named CouponsService
import { Coupon, CouponSchema } from './coupons.model'; // Assuming you have a model named Coupon and its schema

@Module({
    imports: [MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])],
    controllers: [CouponsController],
    providers: [CouponsService],
})
export class CouponsModule { }
