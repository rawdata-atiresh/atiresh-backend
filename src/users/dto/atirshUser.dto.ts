import { IsEmail, IsNotEmpty } from "class-validator";

export class NewAtireshUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  // @IsEmail()
  email: string;

  @IsNotEmpty()
  mobile: number;
  
  address: string;

}


export class UpdateAtireshUserDto {
  @IsNotEmpty()
  _id: string;

  first_name: string;
  last_name: string;
  email:string;
  mobile: number;
  address: string;
}