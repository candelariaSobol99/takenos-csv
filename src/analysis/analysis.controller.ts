import { Controller, Get, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
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

}
