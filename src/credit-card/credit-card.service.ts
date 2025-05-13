import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma.service';
import { CreditCard, Prisma } from '@prisma/client';

@Injectable()
export class CreditCardService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async create(
    data: Prisma.CreditCardCreateInput,
  ): Promise<CreditCard> {
    const creditCard = await this.prisma.creditCard.create({ data });

    this.client.emit('register', {
      id: randomUUID(),
      data: { notification: JSON.stringify(creditCard) },
    });

    setTimeout(() => {
      this.client.emit('confirmation', {
        id: randomUUID(),
        data: { notification: JSON.stringify(creditCard) },
      });
    }, 10_000);

    return creditCard;
  }
}
