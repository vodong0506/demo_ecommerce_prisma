import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { Auth } from '../entities/auth.entity';

// (DTO này dùng để nhận dữ liệu khi người dùng yêu cầu quên mật khẩu, cho phép họ nhập email hoặc số điện thoại, kèm theo đường dẫn chuyển hướng.)
export class ForgotPasswordDto extends PartialType(
  PickType(Auth, ['email', 'phone']),
) {
  redirectTo!: string;
}

// (DTO này dùng để nhận dữ liệu khi người dùng đặt lại mật khẩu, bao gồm mật khẩu mới và ID của người dùng cần reset.)
export class ResetPasswordDto extends PickType(Auth, ['password']) {
  userID!: User['id'];
  user!: UserInfo;
  token!: string;
}
