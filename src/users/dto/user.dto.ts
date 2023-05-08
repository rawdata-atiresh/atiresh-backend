import { IsEmail, IsNotEmpty } from "class-validator";

export class NewUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  // @IsEmail()
  email: string;

  postcode: number;

  website: string;

  @IsNotEmpty()
  mobile: number;


  address: string;

  @IsNotEmpty()
  company: string;

  // @IsNotEmpty()
  // client: string;

  // @IsNotEmpty()
  // role: string;

  picture: string;
}


export class UpdateUserDto {
  @IsNotEmpty()
  _id: string;

  first_name: string;
  last_name: string;
  postcode: number;
  website: string;
  mobile: number;
  address: string;
  company: string;
  //role: string;
  picture: string;
}