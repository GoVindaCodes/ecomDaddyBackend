// app.module.ts

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongodbModule } from './mongodb.module';
import { UsersModule } from './users/users.module';

//Coded by: Rahul 01-12-2023
import { CategoriesModule } from './category/category.module';
import { BrandsModule } from './brands/brands.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { LanguagesModule } from './languages/languages.module';
import { CountriesModule } from './country/country.module';
import * as express from 'express';
import { join } from 'path'; // Importing the join function from the path module

import { AppController } from './app.controller';
import { AppService } from './app.service';

/* Created By: Rahul 30-11-2023 */
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { AttributesModule } from './attributes/attributes.module';
import { CouponsModule } from './coupons/coupons.module';
@Module({
  imports: [
    MongodbModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    TestimonialsModule,
    LanguagesModule,
    CountriesModule,
    AttributesModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(__dirname, '..', 'public')))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}