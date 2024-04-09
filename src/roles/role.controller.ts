// roles/roles.controller.ts
/* Created By: Rahul 05-12-2023 */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './role.service';
import { Role } from './role.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRoles(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<Role> {
    return this.rolesService.getRoleById(id);
  }

  @Post()
  async createRole(@Body() role: Role): Promise<Role> {
    return this.rolesService.createRole(role);
  }

  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() role: Role): Promise<Role> {
    return this.rolesService.updateRole(id, role);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<Role> {
    return this.rolesService.deleteRole(id);
  }
}
