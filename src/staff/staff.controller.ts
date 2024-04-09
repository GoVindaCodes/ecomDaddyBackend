// staff/staff.controller.ts
/* Created By: Rahul 05-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Staff } from './staff.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllStaff(): Promise<Staff[]> {
    return this.staffService.getAllStaff();
  }

  @Get(':id')
  async getStaffById(@Param('id') id: string): Promise<Staff> {
    return this.staffService.getStaffById(id);
  }

  @Post()
  async createStaff(@Body() staff: Staff): Promise<Staff> {
    return this.staffService.createStaff(staff);
  }

  @Put(':id')
  async updateStaff(@Param('id') id: string, @Body() staff: Staff): Promise<Staff> {
    return this.staffService.updateStaff(id, staff);
  }

  @Delete(':id')
  async deleteStaff(@Param('id') id: string): Promise<Staff> {
    return this.staffService.deleteStaff(id);
  }
}
