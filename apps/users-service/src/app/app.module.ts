import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsModule } from './nats/nats.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [NatsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
