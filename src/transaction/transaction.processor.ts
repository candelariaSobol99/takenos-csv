import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionService } from './transaction.service';
import { Logger } from '@nestjs/common';

@Processor('csvQueue')
export class TransactionProcessor {

    private readonly logger = new Logger(TransactionProcessor.name);

    constructor(private readonly transactionService: TransactionService) { }

    @Process('csvProcessing')
    async handleFileProcessing(job: Job) {
        this.logger.log('Processing file from job');
        const { fileBuffer } = job.data;

        const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer.data);

        await this.transactionService.parseAndSaveTransactions(buffer);
        this.logger.log('File processing completed');
    }



}
