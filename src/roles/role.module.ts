// roles/role.module.ts
/* Created By: Rahul 05-12-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { Role, RoleSchema } from './role.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
