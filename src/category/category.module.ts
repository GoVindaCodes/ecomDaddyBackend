// category/category.module.ts
/* Created By: Rahul 01-12-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './category.service';
import { Category, CategorySchema } from './category.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule { }
