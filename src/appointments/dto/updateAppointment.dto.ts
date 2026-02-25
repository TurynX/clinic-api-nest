import { Status } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  patientName: string;
  @IsOptional()
  @IsString()
  doctorName: string;
  @IsOptional()
  @IsDateString()
  scheduledAt: string;
  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
