import { Controller, Get } from '@nestjs/common';
import { DashboardService } from '../service/dashboard.service';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('dashboard')
export class DashBoardController {
  constructor(private dashBoardService: DashboardService) {}

  @Roles('ADMIN')
  @Get()
  getDashboard() {
    return this.dashBoardService.getDashboard();
  }
}
