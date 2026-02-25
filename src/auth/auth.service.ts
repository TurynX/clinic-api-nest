import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

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

  listUsers() {
    return this.prisma.user.findMany();
  }
}
