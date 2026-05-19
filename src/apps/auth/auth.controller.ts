import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodResponse } from 'nestjs-zod';
import { SignInDto, SignInResponseDto, SignUpDto } from './dto/sign.dto';
import { SkipAuth } from './auth.decorator';

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
  @ZodResponse({ type: SignInResponseDto }) // (Dùng để validate + chuẩn hoá dữ liệu response trả về từ API)
  async signIn(@Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(signInDto);
    return data;
  }
}
