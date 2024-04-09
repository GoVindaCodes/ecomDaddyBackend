/* Created By: Rahul 01-12-2023 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { Attribute, AttributeSchema } from './attributes.model';

@Module({
    imports: [MongooseModule.forFeature([{ name: Attribute.name, schema: AttributeSchema }])],
    controllers: [AttributesController],
    providers: [AttributesService],
})
export class AttributesModule { }
