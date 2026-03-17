import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async updateProfile(id: string, data: Partial<User>) {
    await this.usersRepo.update(id, data);
    return this.findById(id);
  }

  async getUserListings(id: string) {
    return this.usersRepo.findOne({
      where: { id },
      relations: ['listings', 'listings.photos', 'listings.city'],
    });
  }
}
