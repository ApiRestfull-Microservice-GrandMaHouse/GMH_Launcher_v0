import {
  CreateUserDto,
  PaginationUserDto,
  UpdateUserDto,
} from '@mi-app/shared/dtos/users';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { NATS_SERVICE } from '@mi-app/shared/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private prisma: PrismaService,
  ) {}

  async findAllUsers(getUserDto: PaginationUserDto): Promise<any> {
    this.logger.log(
      `Finding users - page: ${getUserDto.page}, limit: ${getUserDto.limit}, search: ${getUserDto.search}`,
    );

    try {
      const skip = (getUserDto.page - 1) * getUserDto.limit;

      const where: Prisma.UserWhereInput = {
        isActive: getUserDto.isActive,
        ...(getUserDto.search && {
          OR: [
            {
              email: {
                contains: getUserDto.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: getUserDto.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: getUserDto.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              phone: {
                contains: getUserDto.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }),
      };

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: getUserDto.limit,
          where,
          orderBy:
            getUserDto.sort && getUserDto.order
              ? { [getUserDto.sort]: getUserDto.order.toLowerCase() }
              : { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      this.logger.log(`Found ${users.length} users of ${total} total`);

      return {
        data: { users },
        metadata: {
          page: getUserDto.page,
          limit: getUserDto.limit,
          count: users.length,
          total,
          totalPages: Math.ceil(total / getUserDto.limit),
        },
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Hubo un error al obtener los usuarios',
        code: 'FETCHING_USERS_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }
  }

  async findOneUser(id: string): Promise<any> {
    this.logger.log(`Finding user - id: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new RpcException({
          message: `Usuario con id ${id} no encontrado`,
          code: 'USER_NOT_FOUND',
          status: HttpStatus.NOT_FOUND,
          data: {},
        });
      }

      this.logger.log(`Found user - id: ${id}`);
      return {
        data: { user },
        metadata: {},
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error fetching user: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Hubo un error al obtener el usuario',
        code: 'FETCHING_USER_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    this.logger.log(`Creating user - email: ${createUserDto.email}`);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
          phone: createUserDto.phone,
        },
      });

      this.logger.log(`Created user - id: ${user.id}`);
      return {
        data: { user },
        metadata: {},
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Hubo un error al crear el usuario',
        code: 'CREATING_USER_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }
  }

  async deleteUser(id: string): Promise<any> {
    this.logger.log(`Deleting user - id: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new RpcException({
          message: `Usuario con id ${id} no encontrado`,
          code: 'USER_NOT_FOUND',
          status: HttpStatus.NOT_FOUND,
          data: {},
        });
      }

      if (!user.isActive) {
        throw new RpcException({
          message: `Usuario con id ${id} ya se encuentra inactivo`,
          code: 'USER_ALREADY_INACTIVE',
          status: HttpStatus.BAD_REQUEST,
          data: {},
        });
      }

      const deletedUser = await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`Deleted user - id: ${id}`);
      return {
        data: { user: deletedUser },
        metadata: {},
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Hubo un error al eliminar el usuario',
        code: 'DELETING_USER_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    this.logger.log(`Updating user - id: ${id}`);
    try {
      if (Object.keys(updateUserDto).length === 0) {
        throw new RpcException({
          message: 'Al menos un campo debe ser proporcionado',
          code: 'EMPTY_UPDATE_BODY',
          status: HttpStatus.BAD_REQUEST,
          data: {},
        });
      }

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new RpcException({
          message: `Usuario con id ${id} no encontrado`,
          code: 'USER_NOT_FOUND',
          status: HttpStatus.NOT_FOUND,
          data: {},
        });
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      this.logger.log(`Updated user - id: ${id}`);
      return {
        data: { user: updatedUser },
        metadata: {},
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Hubo un error al actualizar el usuario',
        code: 'UPDATING_USER_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }
  }
}
