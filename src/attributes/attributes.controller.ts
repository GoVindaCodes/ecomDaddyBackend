/* Created By: Rahul 01-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch, BadRequestException, Logger } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { Attribute } from './attributes.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attributes')
export class AttributesController {
    constructor(private readonly attributesService: AttributesService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllAttributes(): Promise<Attribute[]> {
        return this.attributesService.getAllAttributes();
    }
    @Get(':id')
    async getAttributeById(@Param('id') id: string): Promise<Attribute> {
        return this.attributesService.getAttributeById(id);
    }
    @Post()
    async addAttribute(@Body() attr: Attribute): Promise<Attribute> {
        return this.attributesService.addAttribute(attr);
    }
    @Put(':id')
    async updateAttribute(@Param('id') id: string, @Body() attr: Attribute): Promise<Attribute> {
        return this.attributesService.updateAttribute(id, attr);
    }
    @Delete(':id')
    async deleteAttribute(@Param('id') id: string): Promise<Attribute> {
        return this.attributesService.deleteAttribute(id);
    }
    @Patch('update/many')
    async updateManyAttributes(@Body() body: { ids: string[], status: string }): Promise<{ message: string }> {
        try {
            const { ids, status } = body;
            await this.attributesService.updateManyAttributes(ids, status);
            Logger.log('Attributes updated successfully');
            return { message: 'Attributes updated successfully' };
        } catch (error) {
            Logger.error(`Failed to update attributes: ${error.message}`);
            throw new BadRequestException(`Failed to update attributes: ${error.message}`);
        }
    }
    @Delete('delete/many')
    async deleteManyAttributes(@Body() ids: string[]): Promise<Attribute[]> {
        try {
            const updatedAttributes = await this.attributesService.deleteManyAttributes(ids);
            return updatedAttributes;
        } catch (error) {
            throw new BadRequestException('Failed to delete attributes');
        }
    }

}
