import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('cities')
  findAllCities() { return this.locationsService.findAllCities(); }

  @Get('cities/:slug')
  findCity(@Param('slug') slug: string) { return this.locationsService.findCityBySlug(slug); }

  @Get('cities/:cityId/districts')
  findDistricts(@Param('cityId') cityId: string) { return this.locationsService.findDistrictsByCity(cityId); }
}
