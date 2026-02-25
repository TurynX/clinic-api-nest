import { Status } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: Date;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
