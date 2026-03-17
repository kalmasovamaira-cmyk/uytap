import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from '../listings/listing.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Listing) private listingsRepo: Repository<Listing>,
  ) {}

  // Full-text search using PostgreSQL ILIKE (fallback when Elasticsearch not configured)
  // In production, integrate Elasticsearch here
  async search(query: string, options: any = {}) {
    const { page = 1, limit = 20, cityId, categoryId, dealType, priceMin, priceMax } = options;

    const qb = this.listingsRepo
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.photos', 'photos', 'photos.isMain = true')
      .leftJoinAndSelect('listing.city', 'city')
      .leftJoinAndSelect('listing.category', 'category')
      .where('listing.status = :status', { status: ListingStatus.ACTIVE });

    if (query) {
      qb.andWhere(
        '(to_tsvector(\'russian\', coalesce(listing.title, \'\') || \' \' || coalesce(listing.description, \'\') || \' \' || coalesce(listing.address, \'\')) @@ plainto_tsquery(\'russian\', :query) OR listing.title ILIKE :ilike)',
        { query, ilike: `%${query}%` },
      );
    }

    if (cityId) qb.andWhere('listing.cityId = :cityId', { cityId });
    if (categoryId) qb.andWhere('listing.categoryId = :categoryId', { categoryId });
    if (dealType) qb.andWhere('listing.dealType = :dealType', { dealType });
    if (priceMin) qb.andWhere('listing.price >= :priceMin', { priceMin });
    if (priceMax) qb.andWhere('listing.price <= :priceMax', { priceMax });

    qb.orderBy('listing.isPremium', 'DESC').addOrderBy('listing.createdAt', 'DESC');

    const [items, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getSuggestions(q: string) {
    if (!q || q.length < 2) return [];
    const results = await this.listingsRepo
      .createQueryBuilder('l')
      .select(['l.id', 'l.title', 'l.price'])
      .leftJoin('l.city', 'city')
      .addSelect(['city.nameRu'])
      .where('l.title ILIKE :q AND l.status = :status', { q: `%${q}%`, status: ListingStatus.ACTIVE })
      .limit(8)
      .getMany();
    return results;
  }
}
