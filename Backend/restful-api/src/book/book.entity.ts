import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('books') // Table name in the database
  export class Book {
    @PrimaryGeneratedColumn('uuid') // Auto-generate a UUID for each book
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'varchar', length: 255 })
    author: string;
  
    @Column({ type: 'varchar', length: 255 })
    publisher: string;
  
    @Column({ type: 'date' })
    dateOfPublication: Date;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
  
    @Column({ default: false })
    isReserved: boolean;
  
    @Column({ nullable: true, type: 'timestamp' })
    reservedUntil: Date;
  
    @Column({ default: false })
    isRented: boolean;
  
    @Column({ nullable: true, type: 'timestamp' })
    rentedUntil: Date;
  
    @Column({ nullable: true, type: 'varchar', length: 255 })
    rentedBy: string; // Optional, to track who rented the book
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  