import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class paginationQueryDto {
  @Type(() => Number)
  @IsPositive()
  @ApiProperty({ example: 1 })
  page: number;

  @Type(() => Number)
  @IsPositive()
  @ApiProperty({ example: 10 })
  limit: number;
}
