import { Body, Controller, Post } from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/createPatient.dto';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}
  @Roles('RECEPTIONIST', 'ADMIN')
  @Post('create')
  createPatient(@Body() body: CreatePatientDto) {
    return this.patientsService.createPatient(body);
  }
}
