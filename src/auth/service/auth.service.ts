import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(body: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    return this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        role: body.role,
        name: body.name,
      },
    });
  }

  async signin(body: LoginDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!existingUser) {
      throw new ConflictException('User not found');
    }
    return existingUser;
  }

  async getMe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new ConflictException('User not found');
    }
    return user;
  }
}
