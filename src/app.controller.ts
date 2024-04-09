// app.controller.ts

import { Controller, Get, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('checkkar')
  getHelloe(): string {
    return this.appService.getHelloe();
  }

  /* Created By: Rahul 30-11-2023 */
  @Post('login')

  /*added by : Govinda 27-03-2024*/
  async login(@Body() { email, password }: { email: string; password: string }): Promise<{ accessToken?: string, message: string }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const user = await this.usersService.loginUser(email, password);
      // Generate and return JWT token upon successful authentication
      const accessToken = this.authService.generateToken({ sub: user.id, username: user.username });
      //return { accessToken };
      //return { message: 'so finally you havee became the buddy of mines' };
      return { message: 'Welcome to the Milky Way! Here is your access token. have it and enjoy routings', accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }
}