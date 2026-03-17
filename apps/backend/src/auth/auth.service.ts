import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({
      where: dto.email ? [{ email: dto.email }] : [{ phone: dto.phone }],
    });
    if (exists) throw new ConflictException('Пользователь уже существует');

    const user = this.usersRepo.create({
      ...dto,
      verificationToken: uuidv4(),
      role: UserRole.USER,
    });
    await this.usersRepo.save(user);
    return this.generateTokens(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    const valid = await user.validatePassword(password);
    return valid ? user : null;
  }

  async login(user: User) {
    if (user.isBlocked) throw new UnauthorizedException('Аккаунт заблокирован');
    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Недействительный refresh token');
    }
  }

  async validateGoogleUser(profile: any): Promise<User> {
    let user = await this.usersRepo.findOne({ where: { googleId: profile.id } });
    if (!user) {
      user = await this.usersRepo.findOne({ where: { email: profile.emails?.[0]?.value } });
      if (user) {
        user.googleId = profile.id;
      } else {
        user = this.usersRepo.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          emailVerified: true,
          role: UserRole.USER,
        });
      }
      await this.usersRepo.save(user);
    }
    return user;
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}
