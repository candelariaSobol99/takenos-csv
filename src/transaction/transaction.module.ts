import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { BullModule } from '@nestjs/bull';
import { TransactionProcessor } from './transaction.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BullModule.registerQueue({ name: 'csvQueue' }),
  ], 
  controllers: [TransactionController],
  providers: [TransactionService, TransactionProcessor],
})
export class TransactionModule {}
