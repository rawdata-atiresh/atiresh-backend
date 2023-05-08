import { IsEmail, IsNotEmpty } from "class-validator";

export class NewClientDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    surname: string;

    @IsNotEmpty()
    company_name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    postcode: string;

    @IsNotEmpty()
    mobile: number;

    @IsNotEmpty()
    telephone: number;

    logo: string;
}