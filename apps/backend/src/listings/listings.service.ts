import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, ILike } from 'typeorm';
import { Listing, ListingStatus } from './listing.entity';
import { ListingPhoto } from './listing-photo.entity';
import { CreateListingDto, FilterListingsDto } from './dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private listingsRepo: Repository<Listing>,
    @InjectRepository(ListingPhoto) private photosRepo: Repository<ListingPhoto>,
  ) {}

  async create(userId: string, dto: CreateListingDto): Promise<Listing> {
    const listing = this.listingsRepo.create({ ...dto, userId, status: ListingStatus.ACTIVE });
    return this.listingsRepo.save(listing);
  }

  async findAll(filters: FilterListingsDto) {
    const {
      cityId, districtId, categoryId, dealType,
      priceMin, priceMax, areaMin, areaMax, rooms,
      isNewBuilding, withPhotos, q,
      page = 1, limit = 20, sort = 'date_desc',
    } = filters;

    const qb = this.listingsRepo
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.photos', 'photos', 'photos.isMain = true')
      .leftJoinAndSelect('listing.city', 'city')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.district', 'district')
      .where('listing.status = :status', { status: ListingStatus.ACTIVE });

    if (cityId) qb.andWhere('listing.cityId = :cityId', { cityId });
    if (districtId) qb.andWhere('listing.districtId = :districtId', { districtId });
    if (categoryId) qb.andWhere('listing.categoryId = :categoryId', { categoryId });
    if (dealType) qb.andWhere('listing.dealType = :dealType', { dealType });
    if (priceMin) qb.andWhere('listing.price >= :priceMin', { priceMin });
    if (priceMax) qb.andWhere('listing.price <= :priceMax', { priceMax });
    if (areaMin) qb.andWhere('listing.area >= :areaMin', { areaMin });
    if (areaMax) qb.andWhere('listing.area <= :areaMax', { areaMax });
    if (rooms) qb.andWhere('listing.rooms = :rooms', { rooms });
    if (isNewBuilding !== undefined) qb.andWhere('listing.isNewBuilding = :isNewBuilding', { isNewBuilding });
    if (withPhotos) qb.andWhere('EXISTS (SELECT 1 FROM listing_photos p WHERE p."listingId" = listing.id)');
    if (q) qb.andWhere('(listing.title ILIKE :q OR listing.description ILIKE :q OR listing.address ILIKE :q)', { q: `%${q}%` });

    // Sorting
    if (sort === 'price_asc') qb.orderBy('listing.price', 'ASC');
    else if (sort === 'price_desc') qb.orderBy('listing.price', 'DESC');
    else qb.orderBy('listing.isPremium', 'DESC').addOrderBy('listing.createdAt', 'DESC');

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingsRepo.findOne({
      where: { id },
      relations: ['photos', 'city', 'district', 'category', 'user'],
    });
    if (!listing) throw new NotFoundException('Объявление не найдено');
    // Increment views
    await this.listingsRepo.increment({ id }, 'views', 1);
    return listing;
  }

  async update(id: string, userId: string, dto: Partial<CreateListingDto>): Promise<Listing> {
    const listing = await this.findOne(id);
    if (listing.userId !== userId) throw new ForbiddenException('Нет доступа');
    Object.assign(listing, dto);
    return this.listingsRepo.save(listing);
  }

  async remove(id: string, userId: string): Promise<void> {
    const listing = await this.findOne(id);
    if (listing.userId !== userId) throw new ForbiddenException('Нет доступа');
    await this.listingsRepo.remove(listing);
  }

  async addPhotos(listingId: string, urls: string[]): Promise<void> {
    const hasPhotos = await this.photosRepo.count({ where: { listingId } });
    const photos = urls.map((url, i) =>
      this.photosRepo.create({ listingId, url, order: hasPhotos + i, isMain: hasPhotos + i === 0 }),
    );
    await this.photosRepo.save(photos);
  }

  async getUserListings(userId: string): Promise<Listing[]> {
    return this.listingsRepo.find({
      where: { userId },
      relations: ['photos', 'city', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getFeatured(limit = 8): Promise<Listing[]> {
    return this.listingsRepo.find({
      where: { status: ListingStatus.ACTIVE },
      order: { isPremium: 'DESC', createdAt: 'DESC' },
      relations: ['photos', 'city', 'category'],
      take: limit,
    });
  }
}
