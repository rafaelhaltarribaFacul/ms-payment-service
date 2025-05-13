import { Body, Controller, Post } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { CreditCard, Prisma } from '@prisma/client';

@Controller('credit-card')
export class CreditCardController {
  constructor(
    private readonly service: CreditCardService,
  ) {}

  @Post('send')
  async send(
    @Body() data: Prisma.CreditCardCreateInput,
  ): Promise<CreditCard> {
    return this.service.create(data);
  }
}
