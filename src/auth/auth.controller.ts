import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Extend the Express Request type to include the user property
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User successfully registered' })
  @ApiConflictResponse({ description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation code
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description:
      'User successfully logged in. Returns access and refresh tokens.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description:
      'Tokens successfully refreshed. Returns new access and refresh tokens.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  async refreshTokens(
    @Req() req: Request,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const user = req.user as any;
    return this.authService.refreshTokens(
      user.id,
      refreshTokenDto.refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user (invalidate refresh token)' })
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  async logout(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.logout(user.id);
  }
}
