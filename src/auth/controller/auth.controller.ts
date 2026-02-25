import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../../common/decorator/public.decorator';
import { User } from 'src/common/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @Public()
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    if (!user) {
      throw new UnauthorizedException('User already exists');
    }

    return user;
  }
  @Public()
  @Post('signin')
  async signin(@Body() body: LoginDto) {
    const user = await this.authService.signin(body);

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

  @Get('profile')
  getProfile(@User() user: any) {
    const userId = user.sub;
    return this.authService.getMe(userId);
  }
}
