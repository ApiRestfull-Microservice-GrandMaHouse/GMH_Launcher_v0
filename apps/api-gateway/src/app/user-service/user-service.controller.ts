import { NATS_SERVICE, UserPatterns } from '@mi-app/shared/constants';
import {
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
} from '@mi-app/shared/dtos/users';
import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  ParseUUIDPipe,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Controller('users')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  getUsers(@Body() getUserDto: GetUserDto) {
    return this.client.send({ cmd: UserPatterns.FIND_ALL }, getUserDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  findOneUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: UserPatterns.FIND_ONE }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('create')
  registerUser(@Body() registerUserDto: CreateUserDto) {
    return this.client.send({ cmd: UserPatterns.CREATE }, registerUserDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: UserPatterns.DELETE }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.client
      .send({ cmd: UserPatterns.UPDATE }, { id, data: { ...updateUserDto } })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
