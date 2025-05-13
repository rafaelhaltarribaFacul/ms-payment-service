import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreditCardController } from './credit-card.controller';
import { CreditCardService }    from './credit-card.service';
import { PrismaService }        from '../prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'notification',
          noAck: true,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [CreditCardController],
  providers:   [CreditCardService, PrismaService],
})
export class CreditCardModule {}
