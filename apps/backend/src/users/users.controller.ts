import { Controller, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Request() req, @Body() body: any) {
    const { password, role, ...data } = body;
    return this.usersService.updateProfile(req.user.id, data);
  }

  @Get(':id/listings')
  getUserListings(@Param('id') id: string) {
    return this.usersService.getUserListings(id);
  }
}
