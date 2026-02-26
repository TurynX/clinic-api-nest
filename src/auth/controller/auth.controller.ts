import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../../common/decorator/public.decorator';
import { User } from 'src/common/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  signin(@Body() body: LoginDto) {
    return this.authService.signin(body);
  }

  @Public()
  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  logout(@Body() body: { refreshToken: string }, @User() user: any) {
    return this.authService.logout(body.refreshToken, user.sub);
  }

  @Get('profile')
  getProfile(@User() user: any) {
    const userId = user.sub;
    return this.authService.getMe(userId);
  }
}
