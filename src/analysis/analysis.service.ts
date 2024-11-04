import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AnalysisService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) { }

  async getTotalVolume(timeFrame: 'day' | 'week' | 'month') {

    try {
      const dateFrom = new Date();
      const now = new Date();

      if (timeFrame === 'day') {
        dateFrom.setDate(dateFrom.getDate() - 1);
      } else if (timeFrame === 'week') {
        dateFrom.setDate(dateFrom.getDate() - 7);
      } else if (timeFrame === 'month') {
        dateFrom.setMonth(dateFrom.getMonth() - 1);
      } else {
        throw new Error('Invalid time frame');
      }

      const result = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.date > :date', { date: dateFrom })
        .getRawOne();


      return {
        timeFrame,
        totalVolume: result.total || 0,
        dateFrom,
        dateTo: now
      };

    } catch (error) {
      throw new InternalServerErrorException(`Ha ocurrido un error al intentar calcular el volumen total de transacciones por ${timeFrame}`)
    }
  }

  async getTopMerchants(limit: number = 10) {
    try {
        const result = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('transaction.merchant', 'merchant')
            .addSelect('SUM(transaction.amount)', 'totalVolume')
            .groupBy('transaction.merchant')
            .orderBy('"totalVolume"', 'DESC')
            .limit(limit)
            .getRawMany();

        return result;
    } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Ha ocurrido un error al intentar obtener los principales merchants por volumen');
    }
}


}
