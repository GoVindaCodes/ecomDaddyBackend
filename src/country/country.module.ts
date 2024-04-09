// country/country.module.ts
/* Created By: Rahul 01-12-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesController } from './country.controller';
import { CountriesService } from './country.service';
import { Country, CountrySchema } from './country.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
