// staff/staff.module.ts
/* Created By: Rahul 05-12-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { Staff, StaffSchema } from './staff.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }])],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
