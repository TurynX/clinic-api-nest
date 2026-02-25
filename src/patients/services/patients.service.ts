import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto } from '../dto/createPatient.dto';
import { UpdatePatientDto } from '../dto/updatePatient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async createPatient(body: CreatePatientDto) {
    const patient = await this.prisma.patient.findFirst({
      where: { email: body.email },
    });
    if (patient) {
      throw new BadRequestException('Email already exists');
    }
    return this.prisma.patient.create({ data: body });
  }

  async getAllPatients() {
    return this.prisma.patient.findMany();
  }

  async getPatientById(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async updatePatient(id: string, body: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (body.email) {
      const patient = await this.prisma.patient.findFirst({
        where: { email: body.email, NOT: { id: id } },
      });

      if (patient) {
        throw new BadRequestException('Email already exists');
      }
    }
    return this.prisma.patient.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.phone && { phone: body.phone }),
        ...(body.gender && { gender: body.gender }),
      },
    });
  }

  async deletePatient(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return this.prisma.patient.delete({ where: { id } });
  }
}
