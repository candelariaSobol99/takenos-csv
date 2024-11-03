import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({unique: true, nullable: false})
    transaction_id: number;

    @Column({ type: 'timestamp', nullable: false })
    date: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    merchant: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    user_id: string;
}


