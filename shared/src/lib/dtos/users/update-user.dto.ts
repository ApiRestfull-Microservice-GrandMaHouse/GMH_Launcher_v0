import { IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  name!: string;
  @IsString()
  lastName!: string;
  @IsString()
  @IsPhoneNumber()
  phone!: string;
}
