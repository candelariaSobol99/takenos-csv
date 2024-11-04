import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Readable } from 'stream';
import { parse } from 'fast-csv';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
    private readonly logger = new Logger('TransactionService');

    constructor(
        private dataSource: DataSource,
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        @InjectQueue('csvQueue') private csvQueue: Queue,
    ) {}

    async processFile(file: Express.Multer.File, email) {
        this.logger.log('Adding file to the queue for processing');
        await this.csvQueue.add('csvProcessing', { fileBuffer: file.buffer, email });
    }

    async parseAndSaveTransactions(fileBuffer: Buffer) {
        this.logger.log('Parsing transactions from CSV file');
        const transactions = await this.parseCsv(fileBuffer);
        this.logger.log(`Parsed ${transactions.length} transactions from CSV`);

        for (const transaction of transactions) {
            await this.create(transaction);
            this.logger.log(`Transaction ${transaction.transaction_id} saved to the database`);
        }
    }

    private async parseCsv(fileBuffer: Buffer): Promise<CreateTransactionDto[]> {
        return new Promise((resolve, reject) => {
            const results: CreateTransactionDto[] = [];

            const stream = Readable.from(fileBuffer).pipe(parse({ headers: true }));

            stream.on('data', (data) => {
  
                if (Object.values(data).some((value) => value !== '')) {
                    const transactionDto: CreateTransactionDto = {
                        transaction_id: parseInt(data.transaction_id),
                        date: data.date,
                        amount: parseFloat(data.amount),
                        merchant: data.merchant,
                        user_id: data.user_id,
                    };
                    results.push(transactionDto);
                }
            });

            stream.on('end', () => resolve(results));
            stream.on('error', (error) => reject(error));
        });
    }

    async create(attrs: CreateTransactionDto, queryRunner?: QueryRunner): Promise<Transaction> {
        const runner = queryRunner ?? this.dataSource.createQueryRunner();
        if (!queryRunner) {
            await runner.connect();
            await runner.startTransaction();
        }

        try {
            const { transaction_id } = attrs;
            const transactionExist = await this.transactionRepository.findOne({ where: { transaction_id } });

            if (transactionExist) {
                throw new BadRequestException(`A transaction already exists with the id ${transaction_id}`);
            }

            const newTransaction = await runner.manager.save(Object.assign(new Transaction(), attrs));

            if (!queryRunner) await runner.commitTransaction();

            return newTransaction;
        } catch (error) {
            this.logger.error(error);
            if (!queryRunner) await runner.rollbackTransaction();
            throw error;
        } finally {
            if (!queryRunner) await runner.release();
        }
    }
}
