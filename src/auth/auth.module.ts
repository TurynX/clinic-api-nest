import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DashBoardController } from './controller/dashBoard.controller';
import { DashboardService } from './service/dashboard.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, DashBoardController],
  providers: [AuthService, DashboardService],
})
export class AuthModule {}
