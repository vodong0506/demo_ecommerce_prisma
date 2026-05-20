import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto/sign.dto';
import { UsersService } from '../users/users.service';
import { StringUtilService } from 'src/common/utils/string-util/string-util.service';
import { JWTToken, TokenKeys } from './consts/jwt.const';
import { MailUtilService } from 'src/common/utils/mail-util/mail-util.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { MailTemplate } from 'src/common/utils/mail-util/mail-util.const';
import { join } from 'path';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly stringUtilService: StringUtilService,
    private mailUtilService: MailUtilService,
  ) {}

  // (sinh ra JWT token cho người dùng sau khi đăng nhập, cặp Access Token và Refresh Token)
  async createToken<T extends Record<string, any>>(payload: T) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: JWTToken.ACCESS_TOKEN_EXPIRE_IN,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: JWTToken.REFRESH_TOKEN_EXPIRE_IN,
    });

    return {
      [TokenKeys.ACCESS_TOKEN_KEY]: accessToken,
      [TokenKeys.REFRESH_TOKEN_KEY]: refreshToken,
    };
  }

  // (kiểm tra token có hợp lệ hay không)
  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token); // (Kiểm tra chữ ký JWT (secret key), Kiểm tra token còn hạn không)
      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException(error);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, ...otherInfo } = signUpDto;
    const user = await this.userService.getUser({ email });
    if (user) throw new BadRequestException('User already exist!');
    // (Hash mật khẩu)
    const passwordHashed = await this.stringUtilService.hash(password);
    const userCreated = await this.userService.createUser({
      email,
      password: passwordHashed,
      ...otherInfo,
    });
    // (Ẩn mật khẩu khi trả về)
    const { password: passwordCreated, ...userResponse } = userCreated;
    console.log(passwordCreated);
    return userResponse;
  }

  // Authentication
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userService.getUser({ email });
    const passwordHashed = user?.password;
    if (!passwordHashed || user?.deletedAt)
      throw new UnauthorizedException('Invalid credentials');
    // (so sánh mật khẩu người dùng nhập với mật khẩu đã hash trong DB.)
    const isMatch = await this.stringUtilService.compare(
      password,
      passwordHashed,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    // (Tạo JWT token)
    const { id: userID, email: userEmail } = user;
    return await this.createToken({ userID, userEmail });
  }

  sendSMS() {
    return {};
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email, phone, redirectTo } = forgotPasswordDto;
    const user = await this.userService.extended.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
    if (!user) throw new UnauthorizedException('Not found user');
    const userEmail = user.email;
    // (gửi mail reset password)
    if (userEmail) {
      await this.mailUtilService.sendMail({
        to: userEmail,
        subject: 'Reset password',
        template: MailTemplate.RESET_PASSWORD,
        context: {
          redirectTo,
          sentAt: new Date().toLocaleString(),
        },
        attachments: [
          {
            filename: 'logo.png',
            path: join(
              process.cwd(),
              'src/common/utils/mail-util/templates/assets/logo.png',
            ),
            cid: 'vtdhub-logo',
          },
        ],
      });
    } else {
      this.sendSMS();
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { userID, password, user } = resetPasswordDto;
    const dataUpdate = {
      password: await this.stringUtilService.hash(password),
      user,
    };
    return await this.userService.extended.update({
      data: dataUpdate,
      where: { id: userID },
    });
  }
}
