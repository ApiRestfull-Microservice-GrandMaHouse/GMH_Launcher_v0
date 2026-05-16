import {
  CreateUserDto,
  PaginationUserDto,
  UpdateUserDto,
} from '@mi-app/shared/dtos/users';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { NATS_SERVICE } from '@mi-app/shared/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private prisma: PrismaService,
  ) {}

  async findAllUsers(getUserDto: PaginationUserDto): Promise<any> {
    return {
      message: 'This action returns all users',
    };
  }

  async findOneUser(id: string): Promise<any> {
    return {
      message: `This action returns a #${id} user`,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
    return {
      message: 'This action creates a new user',
    };
  }

  async deleteUser(id: string): Promise<any> {
    return {
      message: `This action deletes a #${id} user`,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    return {
      message: `This action updates a #${id} user`,
    };
  }
}
