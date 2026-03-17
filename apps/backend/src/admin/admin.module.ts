import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Listing])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
