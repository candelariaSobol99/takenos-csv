import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) { }


  @Get('volume/:timeFrame')
  async getTotalVolume(@Param('timeFrame') timeFrame: 'day' | 'week' | 'month') {
    return this.analysisService.getTotalVolume(timeFrame);
  }

  @Get('top-merchants')
  async getTopMerchants() {
    return this.analysisService.getTopMerchants();
  }

  @Get('fraudulent-transactions')
  async getFraudulentTransactions() {
    return this.analysisService.detectFraudulentTransactions();
  }

}
