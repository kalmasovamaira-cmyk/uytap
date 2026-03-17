import { Controller, Get, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { ListingStatus } from '../listings/listing.entity';

// Simple admin role guard - in production use proper RBAC
import { createParamDecorator, ExecutionContext, ForbiddenException, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user || req.user.role !== 'admin') throw new ForbiddenException('Только для администраторов');
    return true;
  }
}

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getDashboardStats() { return this.adminService.getDashboardStats(); }

  @Get('users')
  getUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getUsers(+page, +limit);
  }

  @Put('users/:id/block')
  blockUser(@Param('id') id: string, @Body() body: { blocked: boolean }) {
    return this.adminService.blockUser(id, body.blocked);
  }

  @Get('listings/pending')
  getPendingListings() { return this.adminService.getPendingListings(); }

  @Put('listings/:id/moderate')
  moderateListing(@Param('id') id: string, @Body() body: { status: ListingStatus }) {
    return this.adminService.moderateListing(id, body.status);
  }

  @Delete('listings/:id')
  deleteListing(@Param('id') id: string) { return this.adminService.deleteListing(id); }
}
