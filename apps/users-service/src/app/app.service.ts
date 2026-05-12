import {
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
} from '@mi-app/shared/dtos/users';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async findAllUsers(getUserDto: GetUserDto): Promise<any> {
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
