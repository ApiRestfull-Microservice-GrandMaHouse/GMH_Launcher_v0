import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserPatterns } from '@mi-app/shared/constants';
import {
  CreateUserDto,
  PaginationUserDto,
  UpdateUserDto,
} from '@mi-app/shared/dtos/users';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: UserPatterns.FIND_ALL })
  findAll(@Payload() getUserDto: PaginationUserDto) {
    return this.appService.findAllUsers(getUserDto);
  }

  @MessagePattern({ cmd: UserPatterns.FIND_ONE })
  findOne(@Payload() payload: { id: string }) {
    return this.appService.findOneUser(payload.id);
  }

  @MessagePattern({ cmd: UserPatterns.CREATE })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: UserPatterns.DELETE })
  delete(@Payload() payload: { id: string }) {
    return this.appService.deleteUser(payload.id);
  }

  @MessagePattern({ cmd: UserPatterns.UPDATE })
  update(@Payload() payload: { id: string; data: UpdateUserDto }) {
    return this.appService.updateUser(payload.id, payload.data);
  }
}
