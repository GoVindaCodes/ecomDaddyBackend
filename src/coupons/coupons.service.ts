// coupons/coupons.service.ts

import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './coupons.model';

@Injectable()
export class CouponsService {
    constructor(@InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>) { }

    async addCoupon(coupon: Coupon): Promise<Coupon> {
        try {
            const createdCoupon = new this.couponModel(coupon);
            return await createdCoupon.save();
        } catch (error) {
            Logger.error(`Error creating coupon: ${error.message}`);
            throw new BadRequestException('Unable to create coupon', error.message);
        }
    }

    async addAllCoupon(coupons: Coupon[]): Promise<Coupon[]> {
        try {
            return await this.couponModel.insertMany(coupons);
        } catch (error) {
            Logger.error(`Error adding all coupons: ${error.message}`);
            throw new BadRequestException('Unable to add coupons', error.message);
        }
    }

    async getAllCoupons(): Promise<Coupon[]> {
        try {
            return await this.couponModel.find().exec();
        } catch (error) {
            Logger.error(`Error getting all coupons: ${error.message}`);
            throw new BadRequestException('Unable to retrieve coupons', error.message);
        }
    }

    async getCouponById(id: string): Promise<Coupon> {
        try {
            const coupon = await this.couponModel.findById(id).exec();
            if (!coupon) {
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }
            return coupon;
        } catch (error) {
            Logger.error(`Error getting coupon by ID: ${error.message}`);
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new BadRequestException('Unable to retrieve coupon', error.message);
            }
        }
    }

    async updateCoupon(id: string, updatedCoupon: Coupon): Promise<Coupon> {
        try {
            const coupon = await this.couponModel.findByIdAndUpdate(id, updatedCoupon, { new: true }).exec();
            if (!coupon) {
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }
            return coupon;
        } catch (error) {
            Logger.error(`Error updating coupon: ${error.message}`);
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new BadRequestException('Unable to update coupon', error.message);
            }
        }
    }

    async updateManyCoupons(ids: string[], updatedFields: any): Promise<{ message: string }> {
        try {
            const result = await this.couponModel.updateMany({ _id: { $in: ids } }, updatedFields).exec();
            if (result.modifiedCount === 0) {
                throw new NotFoundException('No coupons were updated');
            }
            return { message: 'Coupons updated successfully' };
        } catch (error) {
            Logger.error(`Error updating many coupons: ${error.message}`);
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new BadRequestException('Unable to update coupons', error.message);
            }
        }
    }

    async updateStatus(id: string, body: any): Promise<Coupon> {
        try {
            console.log('Updating coupon status...');
            // console.log('Coupon ID:', id);
                console.log('Request body:', body);

            const coupon = await this.couponModel.findById(id).exec();
            if (!coupon) {
                console.log(`Coupon with ID ${id} not found`);
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }

            const newStatus = body.status === 'show' ? 'hide' : 'show';
            console.log('New status:', newStatus);

            const updatedCoupon = await this.couponModel.findByIdAndUpdate(id, { status: newStatus }, { new: true }).exec();
            if (!updatedCoupon) {
                console.log(`Updated coupon with ID ${id} not found`);
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }

            // console.log('Coupon status updated successfully:', updatedCoupon);

            return updatedCoupon;
        } catch (error) {
            console.error('Error updating coupon status:', error.message);
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new BadRequestException('Unable to update coupon status', error.message);
            }
        }
    }


    async deleteCoupon(id: string): Promise<Coupon> {
        try {
            const coupon = await this.couponModel.findByIdAndDelete(id).exec();
            if (!coupon) {
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }
            return coupon;
        } catch (error) {
            Logger.error(`Error deleting coupon: ${error.message}`);
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new BadRequestException('Unable to delete coupon', error.message);
            }
        }
    }

    async deleteManyCoupons(ids: string[]): Promise<{ message: string }> {
        try {
            const result = await this.couponModel.deleteMany({ _id: { $in: ids } }).exec();
            if (result.deletedCount === 0) {
                throw new NotFoundException('No coupons were deleted');
            }
            return { message: 'Coupons deleted successfully' };
        } catch (error) {
            Logger.error(`Error deleting many coupons: ${error.message}`);
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new BadRequestException('Unable to delete coupons', error.message);
            }
        }
    }
}
