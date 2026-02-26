import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/createAppointment.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UpdateAppointmentDto } from '../dto/updateAppointment.dto';
import { User } from 'src/common/decorator/user.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @Roles('DOCTOR', 'ADMIN')
  @Post('create')
  createAppointment(@Body() body: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(body);
  }
  @Roles('DOCTOR', 'ADMIN')
  @Put('update/:id')
  updateAppointment(
    @Param('id') id: string,
    @Body() body: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(id, body);
  }
  @Roles('DOCTOR', 'ADMIN', 'RECEPTIONIST')
  @Get()
  getAllAppointments(@User() user: any) {
    const userId = user.sub;
    return this.appointmentsService.getAllAppointments(userId);
  }

  @Roles('DOCTOR', 'ADMIN', 'RECEPTIONIST')
  @Get(':id')
  getAppointmentById(@Param('id') id: string, @User() user: any) {
    const userId = user.sub;
    return this.appointmentsService.getAppointmentById(id, userId);
  }

  @Roles('DOCTOR', 'ADMIN')
  @Delete(':id')
  deleteAppointment(@Param('id') id: string, @User() user: any) {
    const userId = user.sub;
    return this.appointmentsService.deleteAppointment(id, userId);
  }
}
