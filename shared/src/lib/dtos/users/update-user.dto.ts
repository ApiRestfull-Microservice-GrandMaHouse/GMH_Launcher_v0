import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;
}
