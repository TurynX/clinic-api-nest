import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto } from '../dto/createPatient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async createPatient(body: CreatePatientDto) {
    return this.prisma.patient.create({ data: body });
  }
}
