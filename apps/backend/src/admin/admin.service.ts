import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing, ListingStatus } from '../listings/listing.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Listing) private listingsRepo: Repository<Listing>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalListings, pendingListings, activeListings] = await Promise.all([
      this.usersRepo.count(),
      this.listingsRepo.count(),
      this.listingsRepo.count({ where: { status: ListingStatus.PENDING } }),
      this.listingsRepo.count({ where: { status: ListingStatus.ACTIVE } }),
    ]);
    return { totalUsers, totalListings, pendingListings, activeListings };
  }

  async getUsers(page = 1, limit = 20) {
    const [items, total] = await this.usersRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async blockUser(id: string, blocked: boolean) {
    return this.usersRepo.update(id, { isBlocked: blocked });
  }

  async getPendingListings() {
    return this.listingsRepo.find({
      where: { status: ListingStatus.PENDING },
      relations: ['user', 'city', 'category', 'photos'],
      order: { createdAt: 'ASC' },
    });
  }

  async moderateListing(id: string, status: ListingStatus) {
    return this.listingsRepo.update(id, { status });
  }

  async deleteListing(id: string) {
    return this.listingsRepo.delete(id);
  }
}
