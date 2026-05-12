import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../pagination.dto';

export class PaginationUserDto extends PaginationDto {
@IsOptional()
@IsString()
readonly search?: string;

@IsOptional()
@IsBoolean() // O IsEnum si tienes varios roles
readonly isActive?: boolean;
}
