import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserServiceModule } from './user-service/user-service.module';
import { NatsModule } from './nats/nats.module';

@Module({
  imports: [UserServiceModule, NatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
