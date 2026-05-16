import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsString()
  email!: string;
  @IsString()
  @IsStrongPassword()
  password!: string;
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;
}
