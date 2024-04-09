// roles/role.service.ts
/* Created By: Rahul 05-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>) {}

  async createRole(role: Role): Promise<Role> {    
    const { role_name } = role;

    // Check if the email already exists in the database
    const existingRole = await this.roleModel.findOne({ role_name }).exec();
    if (existingRole) {
      throw new ConflictException('role_name already exists');
    }

    try {
      const createdRole = new this.roleModel(role);
      return await createdRole.save();
    } catch (error) {
      console.error('Error creating role:', error.message);
      throw new BadRequestException('Unable to create role',error.message);
    }
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      return await this.roleModel.find().exec();
    } catch (error) {
      console.error('Error getting all roles:', error.message);
      throw new BadRequestException('Unable to retrieve roles',error.message);
    }
  }

  async getRoleById(id: string): Promise<Role> {
    try {
      const role = await this.roleModel.findById(id).exec();
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      console.error('Error getting role by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve role',error.message);
      }
    }
  }

  async updateRole(id: string, updatedRole: Role): Promise<Role> {
    const { role_name } = updatedRole;

    // Check if the email already exists in the database for other roles
    // const existingRole = await this.roleModel.findOne({ role_name, _id: { $ne: id } }).exec();
    // if (existingRole) {
    //   throw new ConflictException('Role name already exists for another role');
    // }

    try {
      const role = await this.roleModel.findByIdAndUpdate(id, updatedRole, { new: true }).exec();
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      console.error('Error updating role:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update role',error.message);
      }
    }
  }

  async deleteRole(id: string): Promise<Role> {
    try {
      const role = await this.roleModel.findByIdAndDelete(id).exec();
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      console.error('Error deleting role:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete role',error.message);
      }
    }
  }
}
