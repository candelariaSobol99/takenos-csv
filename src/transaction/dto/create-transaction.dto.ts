import { IsNumber, IsString, IsDateString, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {

    @IsNumber()
    @IsNotEmpty()
    transaction_id: number;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    merchant: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;

}

