// users/users.service.ts
/* Created By: Rahul 30-11-2023 */
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  //hashed password added by : Govinda 27-03-2024
  async createUser(user: User): Promise<User> {
    const { email, password, phone } = user;
    //validation for email or phone
    if (!email && !phone) {
      throw new ConflictException('enter email or phone number!!');
    }

    // if email entered password required
    if (email && !password) {
      throw new ConflictException('password cannot be null!!');
    }

    // Check if the email already exists in the database
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (email && existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({ ...user, password: hashedPassword });
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException('Unable to create user', error.message);
    }
  }

  //hashed password added by : Govinda 27-03-2024
  async loginUser(email: string, password: string): Promise<User> {
    const logger = new Logger('LoginUser');

    if (!email || !password) {
      logger.error('Email and password are required');
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      logger.error('User not found for email: ' + email);
      throw new UnauthorizedException('Invalid credentials');
    }
    // Log the provided email and password for debugging
    this.logger.debug('Provided email: ' + email);
    this.logger.debug('Provided password: ' + password);
    // Compare provided password with hashed password from database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    logger.log('Email: ' + email);
    logger.log('Hashed password: ' + user.password);
    logger.log('Is password valid? ' + isPasswordValid);

    //if (password !== user.password) {

    if (!isPasswordValid) {
      logger.error('Invalid password for user: ' + email + ' ' + 'password' + ' ' + password);
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }


  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error getting all users:', error.message);
      throw new BadRequestException('Unable to retrieve users', error.message);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to retrieve user', error.message);
      }
    }
  }

  //created by rahul 05-12-2023
  async createSocialUser(user: User): Promise<User> {
    const { email, social } = user;

    // Check if the email already exists in the database
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      return existingUser;
    }

    if (!social) {
      throw new ConflictException('social type cannot be null!!');
    }

    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException('Unable to create user', error.message);
    }
  }

  async updateUser(id: string, updatedUser: User): Promise<User> {
    const { email } = updatedUser;

    // Check if the email already exists in the database for other users
    const existingUser = await this.userModel.findOne({ email, _id: { $ne: id } }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists for another user');
    }

    try {
      const user = await this.userModel.findByIdAndUpdate(id, updatedUser, { new: true }).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error updating user:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to update user', error.message);
      }
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as it is a client error
      } else {
        throw new BadRequestException('Unable to delete user', error.message);
      }
    }
  }
}
