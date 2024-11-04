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

  async detectFraudulentTransactions() {
    const highAmount = 1000;

    // Regla 1: Transacciones con montos altos
    const highAmountTransactions = await this.transactionRepository
      .createQueryBuilder("transaction")
      .where("transaction.amount > :highAmount", { highAmount })
      .getMany();


    // Regla 2: Transacciones en rápida sucesión (por ejemplo, dentro de 5 minutos para el mismo usuario y merchant)
    const rapidTransactions = await this.transactionRepository
      .createQueryBuilder('t1')
      .select('t1.id')
      .addSelect('t1.user_id')
      .addSelect('t1.merchant')
      .where('EXISTS ' +
        '(SELECT 1 FROM transactions t2 ' +
        'WHERE t2.user_id = t1.user_id ' +
        'AND t2.merchant = t1.merchant ' +
        'AND t2.date > t1.date ' +
        'AND t2.date <= t1.date + INTERVAL \'5 minutes\')')
      .getRawMany();

    return {
      highAmountTransactions: highAmountTransactions,
      rapidTransactions: rapidTransactions
    }
  }



}
