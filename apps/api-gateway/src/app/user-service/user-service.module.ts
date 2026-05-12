import { Module } from '@nestjs/common';
import { AuthController } from './user-service.controller';
import { NatsModule } from '../nats/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
})
export class UserServiceModule {}
