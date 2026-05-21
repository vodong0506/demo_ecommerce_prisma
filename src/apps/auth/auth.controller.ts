import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import ms from 'ms';
import { ZodResponse } from 'nestjs-zod';
import { Cookies } from 'src/common/decorators/cookie/cookie.decorator';
import {
  COOKIE_CONFIG_DEFAULT,
  CookiesToken,
} from '../../common/decorators/cookie/cookie.const';
import { SkipAuth } from './auth.decorator';
import { AuthService } from './auth.service';
import { TokenKeys } from './consts/jwt.const';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { SignInDto, SignInResponseDto, SignUpDto } from './dto/sign.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @SkipAuth()
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @SkipAuth()
  @ZodResponse({ type: SignInResponseDto })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signIn(signInDto);

    res.cookie(TokenKeys.ACCESS_TOKEN_KEY, data.accessToken, {
      ...COOKIE_CONFIG_DEFAULT,
      maxAge: ms(CookiesToken.ACCESS_TOKEN_EXPIRE_IN),
    });
    res.cookie(TokenKeys.REFRESH_TOKEN_KEY, data.refreshToken, {
      ...COOKIE_CONFIG_DEFAULT,
      maxAge: ms(CookiesToken.REFRESH_TOKEN_EXPIRE_IN),
    });
    return data;
  }

  @Post('logout')
  @SkipAuth()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(TokenKeys.ACCESS_TOKEN_KEY, {
      ...COOKIE_CONFIG_DEFAULT,
      maxAge: ms(CookiesToken.ACCESS_TOKEN_EXPIRE_IN),
    });
    res.clearCookie(TokenKeys.REFRESH_TOKEN_KEY, {
      ...COOKIE_CONFIG_DEFAULT,
      maxAge: ms(CookiesToken.REFRESH_TOKEN_EXPIRE_IN),
    });
    return { message: 'Logout success!' };
  }

  @Post('refresh-token')
  @SkipAuth()
  async refreshToken(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.refreshToken(refreshToken);

    res.cookie(TokenKeys.ACCESS_TOKEN_KEY, data.accessToken, {
      ...COOKIE_CONFIG_DEFAULT,
      maxAge: ms(CookiesToken.ACCESS_TOKEN_EXPIRE_IN),
    });
    res.cookie(TokenKeys.REFRESH_TOKEN_KEY, data.refreshToken, {
      ...COOKIE_CONFIG_DEFAULT,
      maxAge: ms(CookiesToken.REFRESH_TOKEN_EXPIRE_IN),
    });
    return data;
  }

  @Post('forgot-password')
  @SkipAuth()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @SkipAuth()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
