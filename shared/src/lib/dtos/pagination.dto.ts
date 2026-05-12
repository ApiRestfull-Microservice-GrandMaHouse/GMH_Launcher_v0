import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
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
  @IsOptional()
  readonly sort?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: "status must be a valid enum value" })
  readonly order?: 'ASC' | 'DESC' = 'DESC';
}
