import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(body: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    return this.prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        role: body.role,
        name: body.name,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
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

    const isPasswordValid = await bcrypt.compare(
      body.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const accessToken = await this.jwtService.signAsync({
      sub: existingUser.id,
      role: existingUser.role,
    });
    const refreshToken = randomUUID();

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: existingUser.id,
        familyId: randomUUID(),
        expiresAt: dayjs().add(7, 'day').toDate(),
      },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenFound = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        user: true,
      },
    });
    if (!refreshTokenFound) {
      throw new ConflictException('Refresh token not found');
    }
    if (refreshTokenFound.revoked) {
      throw new ConflictException('Refresh token revoked');
    }
    if (refreshTokenFound.expiresAt < new Date()) {
      throw new ConflictException('Refresh token expired');
    }

    await this.prisma.refreshToken.update({
      where: {
        id: refreshTokenFound.id,
      },
      data: {
        revoked: true,
      },
    });
    const newRefreshToken = randomUUID();
    const newRefreshTokenHashed = await bcrypt.hash(newRefreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshTokenHashed,
        userId: refreshTokenFound.userId,
        familyId: refreshTokenFound.familyId,
        expiresAt: dayjs().add(7, 'day').toDate(),
      },
    });
    const accessToken = await this.jwtService.signAsync({
      sub: refreshTokenFound.userId,
      role: refreshTokenFound.user.role,
    });
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string, userId: string) {
    const refreshTokenFound = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
        userId,
      },
    });
    if (!refreshTokenFound) {
      throw new ConflictException('Refresh token not found');
    }
    await this.prisma.refreshToken.update({
      where: {
        id: refreshTokenFound.id,
      },
      data: {
        revoked: true,
      },
    });
    return true;
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
