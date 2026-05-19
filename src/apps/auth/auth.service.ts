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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly stringUtilService: StringUtilService,
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
}
