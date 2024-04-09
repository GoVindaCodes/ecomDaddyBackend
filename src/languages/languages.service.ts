// languages/languages.service.ts
/* Created By: Rahul 01-12-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language, LanguageDocument } from './languages.model';

@Injectable()
export class LanguagesService {
  constructor(@InjectModel(Language.name) private readonly languageModel: Model<LanguageDocument>) { }

  async createLanguage(language: Language): Promise<Language> {
    const { name } = language;

    // Check if the email already exists in the database
    const existingLanguage = await this.languageModel.findOne({ name }).exec();
    if (existingLanguage) {
      throw new ConflictException('name already exists');
    }

    try {
      const createdLanguage = new this.languageModel(language);
      return await createdLanguage.save();
    } catch (error) {
      console.error('Error creating language:', error.message);
      throw new BadRequestException('Unable to create language', error.message);
    }
  }

  async getAllLanguages(): Promise<Language[]> {
    try {
      return await this.languageModel.find().exec();
    } catch (error) {
      console.error('Error getting all languages:', error.message);
      throw new BadRequestException('Unable to retrieve languages', error.message);
    }
  }

  async getLanguageById(id: string): Promise<Language> {
    try {
      const language = await this.languageModel.findById(id).exec();
      if (!language) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }
      return language;
    } catch (error) {
      console.error('Error getting language by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve language', error.message);
      }
    }
  }

  async updateLanguage(id: string, updatedLanguage: Language): Promise<Language> {
    const { name } = updatedLanguage;

    // Check if the email already exists in the database for other languages
    const existingLanguage = await this.languageModel.findOne({ name, _id: { $ne: id } }).exec();
    if (existingLanguage) {
      throw new ConflictException('Email already exists for another language');
    }

    try {
      const language = await this.languageModel.findByIdAndUpdate(id, updatedLanguage, { new: true }).exec();
      if (!language) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }
      return language;
    } catch (error) {
      console.error('Error updating language:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update language', error.message);
      }
    }
  }

  async deleteLanguage(id: string): Promise<Language> {
    try {
      const language = await this.languageModel.findByIdAndDelete(id).exec();
      if (!language) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }
      return language;
    } catch (error) {
      console.error('Error deleting language:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete language', error.message);
      }
    }
  }

  async deleteManyLanguages(ids: string[]): Promise<Language[]> {
    try {
      console.log("Deleting languages with IDs:", ids);
      const result = await this.languageModel.deleteMany({ _id: { $in: ids } }).exec();
      console.log("Deletion result:", result);

      if (result.deletedCount === 0) {
        console.log("No languages were deleted.");
        throw new NotFoundException('No languages found with the provided IDs');
      }

      // Fetch and return the deleted languages
      const deletedLanguages = await this.languageModel.find({ _id: { $in: ids } }).exec();
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

  async updateManyLanguages(ids: string[], status: string): Promise<Language[]> {
    try {
      Logger.log(`Updating languages with IDs: ${ids} to status: ${status}`);

      // Construct criteria for the update operation
      const criteria = { _id: { $in: ids } };
      Logger.log(`Criteria used for updateMany: ${JSON.stringify(criteria)}`);

      // Construct fields to be updated
      const updateFields = { status };
      Logger.log(`Fields used for updateMany: ${JSON.stringify(updateFields)}`);

      // Perform the update operation
      const result = await this.languageModel.updateMany(criteria, updateFields).exec();
      Logger.log(`Update Result: ${result}`);

      // Check if any languages were updated
      if (result.modifiedCount === 0) {
        throw new NotFoundException('No languages were updated.');
      }

      // Find and return the updated languages
      const updatedResults = await this.languageModel.find(criteria).exec();
      Logger.log(`Updated languages: ${JSON.stringify(updatedResults)}`);

      return updatedResults;
    } catch (error) {
      Logger.error(`Error updating languages: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('Error updating languages.', error.message);
      }
    }
  }


  async updateStatus(id: string): Promise<Language> {
    try {
      const language = await this.languageModel.findById(id).exec();
      if (!language) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }
      const newStatus = language.status === 'show' ? 'hide' : 'show';
      const updatedLanguage = await this.languageModel.findByIdAndUpdate(id, { status: newStatus }, { new: true }).exec();
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



  // async updateStatus(id: string): Promise<Language> {
  //   try {
  //     if (id === 'show') {
  //       // Handle special case to update status for all languages
  //       // Perform the necessary logic here
  //       return null; // Return an appropriate response
  //     }

  //     const language = await this.languageModel.findById(id).exec();
  //     if (!language) {
  //       throw new NotFoundException(`Language with ID ${id} not found`);
  //     }
  //     const newStatus = language.status === 'show' ? 'hide' : 'show';
  //     const updatedLanguage = await this.languageModel.findByIdAndUpdate(id, { status: newStatus }, { new: true }).exec();
  //     if (!updatedLanguage) {
  //       throw new NotFoundException(`Language with ID ${id} not found`);
  //     }
  //     return updatedLanguage;
  //   } catch (error) {
  //     console.error('Error updating language status:', error.message);
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     } else {
  //       throw new BadRequestException('Unable to update language status', error.message);
  //     }
  //   }
  // }




  // async updateStatus(id: string): Promise<Language> {
  //   try {
  //     const language = await this.languageModel.findByIdAndUpdate(id).exec();
  //     if (!language) {
  //       throw new NotFoundException(`Language with ID ${id} not found`);
  //     }
  //     return language;
  //   } catch (error) {
  //     console.error('Error deleting language:', error.message);
  //     if (error instanceof NotFoundException) {
  //       throw error; // Re-throw NotFoundException as it is a client error
  //     } else {
  //       throw new BadRequestException('Unable to delete language', error.message);
  //     }
  //   }
  // }






  // async updateStatus(ids: string[], status: string): Promise<Language[]> {
  //   try {
  //     Logger.log(`Updating languages with IDs: ${ids} to status: ${status}`);

  //     const criteria = { id: { $in: ids }, status: status };
  //     Logger.log(`Criteria used for updateMany: ${JSON.stringify(criteria)}`);
  //     const updateFields = { status };
  //     const result = await this.languageModel.updateMany(updateFields).exec();
  //     Logger.log(`Update Result: ${result}`); // Log the result of the update operation
  //     Logger.log(`Update Result - nModified: ${result.modifiedCount}`);

  //     Logger.log(`Criteria used for updateMany: ${JSON.stringify(updateFields)}`);

  //     if (result.modifiedCount === 0) {
  //       throw new NotFoundException("No languages were updated.");
  //     }

  //     const updatedResults = await this.languageModel.find(criteria).exec();
  //     Logger.log(`Updated languages: ${JSON.stringify(updatedResults)}`);

  //     return updatedResults;
  //   } catch (error) {
  //     Logger.error(`Error updating languages: ${error.message}`);
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     } else {
  //       throw new BadRequestException("Error updating languages.", error.message);
  //     }
  //   }
  // }


}
