import { Min } from 'class-validator';
import {
  Check,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Check(`"balance" >= 0`)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column({ length: 1000 })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Min(0, { message: 'Balance cannot be negative' })
  balance: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}
