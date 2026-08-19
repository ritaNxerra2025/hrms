import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../common/types/authenticated-user';
import { AuthService } from './auth.service';
import { AuthTokensResponse } from './dto/auth-tokens.response';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './strategies/local-auth.guard';
import { AuthProfile, AuthTokens, ValidatedUser } from './types/auth.types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new Tenant Company and its initial Company Admin',
    description:
      'Creates the tenant, sets up default roles (Admin, HR Admin, HR Manager, Employee) and default departments, and registers the company admin.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tenant and admin successfully registered.',
    type: AuthTokensResponse,
  })
  register(@Body() dto: RegisterDto): Promise<AuthTokensResponse> {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated.',
    type: AuthTokensResponse,
  })
  login(
    @Body() _dto: LoginDto,
    @Req() request: Request,
  ): Promise<AuthTokensResponse> {
    return this.authService.login(request.user as ValidatedUser);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a valid refresh token for new tokens' })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokens> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current authenticated user profile, roles, and permissions',
  })
  me(@CurrentUser() user: AuthenticatedUser): Promise<AuthProfile> {
    return this.authService.me(user.userId);
  }
}
