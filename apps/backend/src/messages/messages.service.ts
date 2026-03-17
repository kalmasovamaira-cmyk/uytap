import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private msgRepo: Repository<Message>) {}

  async send(senderId: string, receiverId: string, listingId: string, text: string) {
    const msg = this.msgRepo.create({ senderId, receiverId, listingId, text });
    return this.msgRepo.save(msg);
  }

  async getConversation(userId: string, otherId: string) {
    return this.msgRepo
      .createQueryBuilder('msg')
      .where('(msg.senderId = :userId AND msg.receiverId = :otherId)', { userId, otherId })
      .orWhere('(msg.senderId = :otherId AND msg.receiverId = :userId)', { userId, otherId })
      .orderBy('msg.createdAt', 'ASC')
      .getMany();
  }

  async getInbox(userId: string) {
    return this.msgRepo
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.listing', 'listing')
      .where('msg.receiverId = :userId', { userId })
      .orderBy('msg.createdAt', 'DESC')
      .getMany();
  }

  async markRead(id: string, userId: string) {
    return this.msgRepo.update({ id, receiverId: userId }, { readAt: new Date() });
  }
}
