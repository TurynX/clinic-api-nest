import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      user,
      token: await this.jwtService.signAsync(payload),
    };
  }
  @UseGuards(AuthGuard)
  @Get('listUsers')
  listUsers() {
    return this.authService.listUsers();
  }
}
