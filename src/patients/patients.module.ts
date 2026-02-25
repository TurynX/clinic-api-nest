import { Module } from '@nestjs/common';
import { PatientsController } from './controllers/patients.controller';
import { PatientsService } from './services/patients.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
