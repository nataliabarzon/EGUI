import { Entity, PrimaryGeneratedColumn, Column, TableInheritance, OneToMany,OneToOne,JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constants/roles.enum';


@Entity()
export class User {

  

  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Name of the user', nullable:true })
  name?: string;

  @Column()
  @ApiProperty({ description: 'Surname of the user', nullable:true })
  surname?: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Unique email address of the user' })
  email: string;

  @Column()
  @ApiProperty({ description: 'Password for the user account' })
  password: string;

  @Column({ default: Role.User })  
  role: Role;


}
