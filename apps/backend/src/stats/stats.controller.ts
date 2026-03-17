import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from '../listings/listing.entity';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(
    @InjectRepository(Listing) private listingsRepo: Repository<Listing>,
  ) {}

  @Get('public')
  async getPublicStats() {
    const [total, byCity] = await Promise.all([
      this.listingsRepo.count({ where: { status: ListingStatus.ACTIVE } }),
      this.listingsRepo
        .createQueryBuilder('l')
        .select('city.nameRu', 'city')
        .addSelect('COUNT(l.id)', 'count')
        .leftJoin('l.city', 'city')
        .where('l.status = :s', { s: ListingStatus.ACTIVE })
        .groupBy('city.nameRu')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
    ]);
    return { totalListings: total, topCities: byCity };
  }

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getMyStats(@Request() req) {
    const stats = await this.listingsRepo
      .createQueryBuilder('l')
      .select('SUM(l.views)', 'totalViews')
      .addSelect('COUNT(l.id)', 'totalListings')
      .addSelect("SUM(CASE WHEN l.status = 'active' THEN 1 ELSE 0 END)", 'activeListings')
      .where('l.userId = :userId', { userId: req.user.id })
      .getRawOne();
    return stats;
  }
}
