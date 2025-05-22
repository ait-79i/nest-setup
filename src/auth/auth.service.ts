import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { CreateUtilisateurDto } from 'src/utilisateur/dto/create-utilisateur.dto';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UtilisateurService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async register(createUserDto: CreateUtilisateurDto) {
    // Create the user
    const user = await this.userService.create(createUserDto);

    // Generate tokens for the newly registered user
    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    // Remove the password from the response
    const { motDePasse, ...result } = user;

    return {
      user: result,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.prenom,
        lastName: user.nom,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur not found');
    }

    const storedRefreshToken = await this.findRefreshToken(
      user.id,
      refreshToken,
    );
    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedRefreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const isTokenExpired = new Date() > storedRefreshToken.expiresAt;
    if (isTokenExpired) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke the old refresh token
    await this.revokeRefreshToken(storedRefreshToken.id);

    // Generate new tokens
    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.revokeAllUserRefreshTokens(userId);
    return { message: 'Logout successful' };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<Utilisateur | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private async generateTokens(user: Utilisateur) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(user: Utilisateur): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(user: Utilisateur): Promise<string> {
    const payload = {
      sub: user.id,
    };

    return this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'your-refresh-secret-key',
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });
  }

  private async storeRefreshToken(
    userId: string,
    token: string,
  ): Promise<void> {
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const expiresAt = new Date();

    // Add days to the expiration date based on the value in expiresIn
    const daysMatch = expiresIn.match(/(\d+)d/);
    if (daysMatch) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(daysMatch[1], 10));
    } else {
      // Default to 7 days if no match
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

  private async findRefreshToken(
    userId: string,
    token: string,
  ): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { userId, token },
    });
  }

  private async revokeRefreshToken(id: string): Promise<void> {
    await this.refreshTokenRepository.update(id, { isRevoked: true });
  }

  private async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }
}
