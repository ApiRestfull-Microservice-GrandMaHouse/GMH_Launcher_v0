import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationUserDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  readonly limit: number = 10;
  /*@IsOptional()
  readonly cursor: string;*/
}
