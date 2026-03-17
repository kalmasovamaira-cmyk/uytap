import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Post(':listingId/toggle')
  toggle(@Request() req, @Param('listingId') listingId: string) {
    return this.favoritesService.toggle(req.user.id, listingId);
  }

  @Get(':listingId/status')
  checkStatus(@Request() req, @Param('listingId') listingId: string) {
    return this.favoritesService.isFavorited(req.user.id, listingId);
  }
}
