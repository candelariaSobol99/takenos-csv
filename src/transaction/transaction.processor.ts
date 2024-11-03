import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionService } from './transaction.service';
import { Logger } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';

@Processor('csvQueue')
export class TransactionProcessor {

    private readonly logger = new Logger(TransactionProcessor.name);

    constructor(private readonly transactionService: TransactionService,
        private readonly notificationService: NotificationService
    ) { }

    @Process('csvProcessing')
    async handleFileProcessing(job: Job) {
        this.logger.log('Processing file from job');
        const { fileBuffer } = job.data;

        const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer.data);

        try {
            await this.transactionService.parseAndSaveTransactions(buffer);
            const successContent = 'El archivo se procesó satisfactoriamente. Las transacciones han sido guardadas correctamente.';
            await this.notificationService.sendNotificationEmail(
                'candelariasobol@gmail.com',
                'Procesamiento completo',
                successContent
            )
            this.logger.log('File processing completed');
        } catch (error) {
            const errorContent = 'Hubo un problema procesando el archivo. Error: ' + error.message;
            await this.notificationService.sendNotificationEmail(
                'candelariasobol@gmail.com',
                'Error en el procesamiento',
                errorContent
            );
            this.logger.error('Error during file processing', error.message);
        }
    }



}
