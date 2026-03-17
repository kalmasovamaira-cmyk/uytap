import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { Listing } from '../listings/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [StatsController],
})
export class StatsModule {}
