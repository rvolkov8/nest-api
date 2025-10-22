import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export class BalanceTransferDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(10)
  receiverUsername: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Transfer amount must be greater than 0' })
  amount: number;
}
