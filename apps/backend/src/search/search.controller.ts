import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(
    @Query('q') q: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('cityId') cityId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('dealType') dealType?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
  ) {
    return this.searchService.search(q, { page: +page, limit: +limit, cityId, categoryId, dealType, priceMin, priceMax });
  }

  @Get('suggestions')
  getSuggestions(@Query('q') q: string) {
    return this.searchService.getSuggestions(q);
  }
}
