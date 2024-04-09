// categories/categories.service.ts
/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.model';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) { }


  async createCategory(category: Category): Promise<Category> {
    const { name } = category;
    // Check if the email already exists in the database
    const existingCategory = await this.categoryModel.findOne({ name }).exec();
    if (existingCategory) {
      throw new ConflictException('name already exists');
    }

    try {
      const createdCategory = new this.categoryModel(category);
      return await createdCategory.save();
    } catch (error) {
      console.error('Error creating category:', error.message);
      throw new BadRequestException('Unable to create category', error.message);
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      console.error('Error getting all categories:', error.message);
      throw new BadRequestException('Unable to retrieve categories', error.message);
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error('Error getting category by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve category', error.message);
      }
    }
  }

  async updateCategory(id: string, updatedCategory: Category): Promise<Category> {
    const { name } = updatedCategory;

    // Check if the email already exists in the database for other categories
    const existingCategory = await this.categoryModel.findOne({ name, _id: { $ne: id } }).exec();
    if (existingCategory) {
      throw new ConflictException('Email already exists for another category');
    }

    try {
      const category = await this.categoryModel.findByIdAndUpdate(id, updatedCategory, { new: true }).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error('Error updating category:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update category', error.message);
      }
    }
  }

  async deleteCategory(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findByIdAndDelete(id).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error('Error deleting category:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete category', error.message);
      }
    }
  }

  async deleteManyLanguages(ids: string[]): Promise<Category[]> {
    try {
      console.log("Deleting languages with IDs:", ids);
      const result = await this.categoryModel.deleteMany({ _id: { $in: ids } }).exec();
      console.log("Deletion result:", result);

      if (result.deletedCount === 0) {
        console.log("No languages were deleted.");
        throw new NotFoundException('No languages found with the provided IDs');
      }

      // Fetch and return the deleted languages
      const deletedLanguages = await this.categoryModel.find({ _id: { $in: ids } }).exec();
      console.log("Deleted languages:", deletedLanguages);

      return deletedLanguages;
    } catch (error) {
      console.error('Error deleting languages:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete languages', error.message);
      }
    }
  }
  async updateManyLanguages(ids: string[], status: string): Promise<Category[]> {
    try {
      Logger.log(`Updating languages with IDs: ${ids} to status: ${status}`);

      const criteria = { id: { $in: ids }, status: status };
      Logger.log(`Criteria used for updateMany: ${JSON.stringify(criteria)}`);
      const updateFields = { status };
      const result = await this.categoryModel.updateMany(updateFields).exec();
      Logger.log(`Update Result: ${result}`); // Log the result of the update operation
      Logger.log(`Update Result - nModified: ${result.modifiedCount}`);

      Logger.log(`Criteria used for updateMany: ${JSON.stringify(updateFields)}`);

      if (result.modifiedCount === 0) {
        throw new NotFoundException("No languages were updated.");
      }

      const updatedResults = await this.categoryModel.find(criteria).exec();
      Logger.log(`Updated languages: ${JSON.stringify(updatedResults)}`);

      return updatedResults;
    } catch (error) {
      Logger.error(`Error updating languages: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException("Error updating languages.", error.message);
      }
    }
  }

  async updateStatus(id: string): Promise<Category> {
    try {
      const language = await this.categoryModel.findById(id).exec();
      if (!language) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }
      const newStatus = language.status === 'show' ? 'hide' : 'show';
      const updatedLanguage = await this.categoryModel.findByIdAndUpdate(id, { status: newStatus }, { new: true }).exec();
      if (!updatedLanguage) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }
      return updatedLanguage;
    } catch (error) {
      console.error('Error updating language status:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('Unable to update language status', error.message);
      }
    }
  }

  // async deleteManyCategories(ids: string[]): Promise<void> {
  //   try {
  //     const result = await this.categoryModel.deleteMany({ _id: { $in: ids } }).exec();
  //     if (result.deletedCount === 0) {
  //       throw new NotFoundException('No categories found with the provided IDs');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting categories:', error.message);
  //     if (error instanceof NotFoundException) {
  //       throw error; // Re-throw NotFoundException as it is a client error
  //     } else {
  //       throw new BadRequestException('Unable to delete categories', error.message);
  //     }
  //   }
  // }
}
