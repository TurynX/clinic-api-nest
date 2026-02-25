import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/createPatient.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UpdatePatientDto } from '../dto/updatePatient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles('RECEPTIONIST', 'ADMIN')
  @Post('create')
  createPatient(@Body() body: CreatePatientDto) {
    return this.patientsService.createPatient(body);
  }

  @Roles('RECEPTIONIST', 'ADMIN')
  @Get('getAll')
  getAllPatients() {
    return this.patientsService.getAllPatients();
  }

  @Roles('RECEPTIONIST', 'ADMIN')
  @Get(':id')
  getPatientById(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }

  @Roles('RECEPTIONIST', 'ADMIN')
  @Put('update/:id')
  updatePatient(@Param('id') id: string, @Body() body: UpdatePatientDto) {
    return this.patientsService.updatePatient(id, body);
  }

  @Roles('RECEPTIONIST', 'ADMIN')
  @Delete('delete/:id')
  deletePatient(@Param('id') id: string) {
    return this.patientsService.deletePatient(id);
  }
}
