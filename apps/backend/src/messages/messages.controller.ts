import { Controller, Get, Post, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('inbox')
  getInbox(@Request() req) { return this.messagesService.getInbox(req.user.id); }

  @Get(':userId')
  getConversation(@Request() req, @Param('userId') otherId: string) {
    return this.messagesService.getConversation(req.user.id, otherId);
  }

  @Post()
  send(@Request() req, @Body() body: { receiverId: string; listingId?: string; text: string }) {
    return this.messagesService.send(req.user.id, body.receiverId, body.listingId!, body.text);
  }

  @Put(':id/read')
  markRead(@Param('id') id: string, @Request() req) {
    return this.messagesService.markRead(id, req.user.id);
  }
}
