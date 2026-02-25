import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from '../dto/createAppointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAppointmentDto } from '../dto/updateAppointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  async createAppointment(body: CreateAppointmentDto) {
    const patient = await this.prisma.patient.findFirst({
      where: { name: body.patientName },
    });
    const doctor = await this.prisma.user.findFirst({
      where: { name: body.doctorName },
    });
    if (!patient || !doctor) {
      return new NotFoundException('Patient or Doctor not found');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        patientName: patient.name,
        doctorName: doctor.name,
        patientId: patient.id,
        doctorId: doctor.id,
        scheduleAt: new Date(body.scheduledAt),
        status: body.status,
      },
    });
    return appointment;
  }
  async updateAppointment(id: string, body: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id },
    });
    if (!appointment) {
      return new NotFoundException('Appointment not found');
    }
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        ...(body.patientName && { patientName: body.patientName }),
        ...(body.doctorName && { doctorName: body.doctorName }),
        ...(body.scheduledAt && { scheduleAt: new Date(body.scheduledAt) }),
        ...(body.status && { status: body.status }),
      },
    });
    return updatedAppointment;
  }

  async getAllAppointments(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return new NotFoundException('User not found');
    }
    if (user.role === 'DOCTOR') {
      const appointments = await this.prisma.appointment.findMany({
        where: { doctorId: userId },
      });
      if (!appointments) {
        return new NotFoundException('Appointments not found');
      }
      return appointments;
    }
    const appointments = await this.prisma.appointment.findMany();
    if (!appointments) {
      return new NotFoundException('Appointments not found');
    }
    return appointments;
  }

  async getAppointmentById(id: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return new NotFoundException('User not found');
    }
    const appointment = await this.prisma.appointment.findFirst({
      where: { id },
    });
    if (!appointment) {
      return new NotFoundException('Appointment not found');
    }
    if (user.role === 'DOCTOR') {
      const isYourAppointment = appointment.doctorId === userId;
      if (!isYourAppointment) {
        return new ForbiddenException(
          'You are not authorized to view this appointment',
        );
      }
    }
    return appointment;
  }

  async deleteAppointment(id: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return new NotFoundException('User not found');
    }
    const appointment = await this.prisma.appointment.findFirst({
      where: { id },
    });
    if (!appointment) {
      return new NotFoundException('Appointment not found');
    }
    if (user.role === 'DOCTOR') {
      const isYourAppointment = appointment.doctorId === userId;
      if (!isYourAppointment) {
        return new ForbiddenException(
          'You are not authorized to delete this appointment',
        );
      }
    }
    await this.prisma.appointment.delete({
      where: { id },
    });
    return { message: 'Appointment deleted successfully' };
  }
}
