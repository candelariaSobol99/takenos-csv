import { Controller, Post, UploadedFile, UseInterceptors, HttpCode, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {

  private readonly logger = new Logger(TransactionController.name);
  
  constructor(private readonly transactionService: TransactionService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(202)
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.logger.log('File received for processing');
    await this.transactionService.processFile(file);
    return { message: 'File received and processing started' };
  }
}

