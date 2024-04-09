/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attribute, AttributeDocument } from './attributes.model';

@Injectable()
export class AttributesService {
    constructor(@InjectModel(Attribute.name) private readonly attributeModel: Model<AttributeDocument>) { }

    async createAttribute(attribute: Attribute): Promise<Attribute> {
        const { title } = attribute;

        // Check if the title already exists in the database
        const existingAttribute = await this.attributeModel.findOne({ title }).exec();
        if (existingAttribute) {
            throw new ConflictException('Title already exists');
        }

        try {
            const createdAttribute = new this.attributeModel(attribute);
            return await createdAttribute.save();
        } catch (error) {
            console.error('Error creating attribute:', error.message);
            throw new BadRequestException('Unable to create attribute', error.message);
        }
    }

    async getAllAttributes(): Promise<Attribute[]> {
        try {
            return await this.attributeModel.find().exec();
        } catch (error) {
            console.error('Error getting all attributes:', error.message);
            throw new BadRequestException('Unable to retrieve attributes', error.message);
        }
    }

    async getAttributeById(id: string): Promise<Attribute> {
        try {
            const attribute = await this.attributeModel.findById(id).exec();
            if (!attribute) {
                throw new NotFoundException(`Attribute with ID ${id} not found`);
            }
            return attribute;
        } catch (error) {
            console.error('Error getting attribute by ID:', error.message);
            if (error instanceof NotFoundException) {
                throw error; // Re-throw NotFoundException as it is a client error
            } else {
                throw new BadRequestException('Unable to retrieve attribute', error.message);
            }
        }
    }

    async updateAttribute(id: string, updatedAttribute: Attribute): Promise<Attribute> {
        const { title } = updatedAttribute;

        // Check if the title already exists in the database for other attributes
        const existingAttribute = await this.attributeModel.findOne({ title, _id: { $ne: id } }).exec();
        if (existingAttribute) {
            throw new ConflictException('Title already exists for another attribute');
        }

        try {
            const attribute = await this.attributeModel.findByIdAndUpdate(id, updatedAttribute, { new: true }).exec();
            if (!attribute) {
                throw new NotFoundException(`Attribute with ID ${id} not found`);
            }
            return attribute;
        } catch (error) {
            console.error('Error updating attribute:', error.message);
            if (error instanceof NotFoundException) {
                throw error; // Re-throw NotFoundException as it is a client error
            } else {
                throw new BadRequestException('Unable to update attribute', error.message);
            }
        }
    }

    async deleteAttribute(id: string): Promise<Attribute> {
        try {
            console.log("hi", id)
            const attribute = await this.attributeModel.findByIdAndDelete(id).exec();
            if (!attribute) {
                throw new NotFoundException(`Attribute with ID ${id} not found`);
            }
            return attribute;
        } catch (error) {
            console.error('Error deleting attribute:', error.message);
            if (error instanceof NotFoundException) {
                throw error; // Re-throw NotFoundException as it is a client error
            } else {
                throw new BadRequestException('Unable to delete attribute', error.message);
            }
        }
    }

    async deleteManyAttributes(ids: string[]): Promise<Attribute[]> {
        try {
            console.log("Deleting attributes with IDs:", ids);
            const result = await this.attributeModel.deleteMany({ _id: { $in: ids } }).exec();
            console.log("Deletion result:", result);

            if (result.deletedCount === 0) {
                console.log("No attributes were deleted.");
                throw new NotFoundException('No attributes found with the provided IDs');
            }

            // Fetch and return the deleted attributes
            const deletedAttributes = await this.attributeModel.find({ _id: { $in: ids } }).exec();
            console.log("Deleted attributes:", deletedAttributes);

            return deletedAttributes;
        } catch (error) {
            console.error('Error deleting attributes:', error.message);
            if (error instanceof NotFoundException) {
                throw error; // Re-throw NotFoundException as it is a client error
            } else {
                throw new BadRequestException('Unable to delete attributes', error.message);
            }
        }
    }

    async addAttribute(attr: Attribute): Promise<Attribute> {
        try {
            const createdAttribute = new this.attributeModel(attr);
            return await createdAttribute.save();
        } catch (error) {
            console.error('Error creating attribute:', error.message);
            throw new BadRequestException('Unable to create attribute', error.message);
        }
    }

    async updateManyAttributes(ids: string[], status: string): Promise<Attribute[]> {
        try {
            Logger.log(`Updating attributes with IDs: ${ids} to status: ${status}`);

            const criteria = { id: { $in: ids }, status: status };
            Logger.log(`Criteria used for updateMany: ${JSON.stringify(criteria)}`);
            const updateFields = { status };
            const result = await this.attributeModel.updateMany(updateFields).exec();
            Logger.log(`Update Result: ${result}`); // Log the result of the update operation
            Logger.log(`Update Result - nModified: ${result.modifiedCount}`);

            Logger.log(`Criteria used for updateMany: ${JSON.stringify(updateFields)}`);

            if (result.modifiedCount === 0) {
                throw new NotFoundException("No attributes were updated.");
            }

            const updatedResults = await this.attributeModel.find(criteria).exec();
            Logger.log(`Updated attributes: ${JSON.stringify(updatedResults)}`);

            return updatedResults;
        } catch (error) {
            Logger.error(`Error updating attributes: ${error.message}`);
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new BadRequestException("Error updating attributes.", error.message);
            }
        }
    }

}
