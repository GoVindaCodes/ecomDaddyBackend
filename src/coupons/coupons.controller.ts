    import { Controller, Get, Post, Body, Param, Put, Delete, Patch, BadRequestException, Logger } from '@nestjs/common';
    import { CouponsService } from './coupons.service';

    @Controller('coupons')
    export class CouponsController {
        constructor(private readonly couponsService: CouponsService) { }

        @Post('add')
        async addCoupon(@Body() body: any): Promise<any> {
            return this.couponsService.addCoupon(body);
        }

        @Post('add/all')
        async addAllCoupon(@Body() body: any): Promise<any> {
            return this.couponsService.addAllCoupon(body);
        }

        @Get()
        async getAllCoupons(): Promise<any> {
            return this.couponsService.getAllCoupons();
        }

        @Get(':id')
        async getCouponById(@Param('id') id: string): Promise<any> {
            return this.couponsService.getCouponById(id);
        }

        @Put(':id')
        async updateCoupon(@Param('id') id: string, @Body() body: any): Promise<any> {
            return this.couponsService.updateCoupon(id, body);
        }

        @Patch('update/many')
        async updateManyCoupons(@Body() body: any): Promise<any> {
            const { ids, updatedFields } = body; // Destructure the body object to extract ids and updatedFields
            return this.couponsService.updateManyCoupons(ids, updatedFields); // Pass both arguments to the service method
        }

        @Put('status/:id')
        async updateStatus(@Param('id') id: string, @Body() body: any): Promise<any> {
            return this.couponsService.updateStatus(id, body);
        }

        @Delete(':id')
        async deleteCoupon(@Param('id') id: string): Promise<any> {
            return this.couponsService.deleteCoupon(id);
        }

        @Patch('delete/many')
        async deleteManyCoupons(@Body() body: any): Promise<any> {
            return this.couponsService.deleteManyCoupons(body);
        }
    }
