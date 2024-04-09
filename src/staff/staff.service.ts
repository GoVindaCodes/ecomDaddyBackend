// staff/staff.service.ts
/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from './staff.model';

@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private readonly staffModel: Model<StaffDocument>) {}

  async createStaff(staff: Staff): Promise<Staff> {    
    const { user_id, role_id } = staff;

    // Check if the email already exists in the database
    const existingStaff = await this.staffModel.findOne({ user_id, role_id }).exec();
    if (existingStaff) {
      throw new ConflictException('role already assigned');
    }

    try {
      const createdStaff = new this.staffModel(staff);
      return await createdStaff.save();
    } catch (error) {
      console.error('Error creating staff:', error.message);
      throw new BadRequestException('Unable to create staff',error.message);
    }
  }

  async getAllStaff(): Promise<Staff[]> {
    try {
      return await this.staffModel.find().exec();
    } catch (error) {
      console.error('Error getting all staff:', error.message);
      throw new BadRequestException('Unable to retrieve staff',error.message);
    }
  }

  async getStaffById(id: string): Promise<Staff> {
    try {
      const staff = await this.staffModel.findById(id).exec();
      if (!staff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
      return staff;
    } catch (error) {
      console.error('Error getting staff by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve staff',error.message);
      }
    }
  }

  async updateStaff(id: string, updatedStaff: Staff): Promise<Staff> {
    const { user_id } = updatedStaff;

    // Check if the email already exists in the database for other staff
    // const existingStaff = await this.staffModel.findOne({ user_id, _id: { $ne: id } }).exec();
    // if (existingStaff) {
    //   throw new ConflictException('Email already exists for another staff');
    // }

    try {
      const staff = await this.staffModel.findByIdAndUpdate(id, updatedStaff, { new: true }).exec();
      if (!staff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
      return staff;
    } catch (error) {
      console.error('Error updating staff:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update staff',error.message);
      }
    }
  }

  async deleteStaff(id: string): Promise<Staff> {
    try {
      const staff = await this.staffModel.findByIdAndDelete(id).exec();
      if (!staff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
      return staff;
    } catch (error) {
      console.error('Error deleting staff:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete staff',error.message);
      }
    }
  }
}
