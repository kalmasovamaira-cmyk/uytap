import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(@InjectRepository(Favorite) private favRepo: Repository<Favorite>) {}

  async toggle(userId: string, listingId: string) {
    const existing = await this.favRepo.findOne({ where: { userId, listingId } });
    if (existing) {
      await this.favRepo.remove(existing);
      return { saved: false };
    }
    await this.favRepo.save(this.favRepo.create({ userId, listingId }));
    return { saved: true };
  }

  async getUserFavorites(userId: string) {
    return this.favRepo.find({
      where: { userId },
      relations: ['listing', 'listing.photos', 'listing.city', 'listing.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async isFavorited(userId: string, listingId: string): Promise<boolean> {
    const fav = await this.favRepo.findOne({ where: { userId, listingId } });
    return !!fav;
  }
}
