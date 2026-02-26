import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async getDashboard() {
    const users = await this.prisma.user.count();
    const patients = await this.prisma.patient.count();
    const appointments = await this.prisma.appointment.count();

    return {
      users,
      patients,
      appointments,
    };
  }
}
