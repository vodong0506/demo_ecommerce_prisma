import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TokenKeys } from '../consts/jwt.const';
import { UserSchema } from 'src/generated/zod';
import { withResponse } from 'src/common/interceptors/format-response/format-response.util';

// (chỉ cho phép nhận email và password khi người dùng đăng nhập.)
const SignInSchema = UserSchema.pick({
  email: true,
  password: true,
}).extend({
  email: z.string().email('Invalid email'),
  password: z.string().min(5, 'Password must be at least 6 characters long'),
});

// (kế thừa SignIn + thêm thông tin khác)
const SignUpSchema = SignInSchema.merge(
  UserSchema.pick({
    firstName: true,
    fullAddress: true,
  }),
).extend({
  firstName: z.string().min(1, 'First name is required'),
  fullAddress: z.string().min(5, 'Address is too short'),
});

// (mô tả cấu trúc dữ liệu trả về sau khi đăng nhập thành công, bao gồm accessToken và refreshToken.)
const SignInResponseSchema = withResponse(
  z.object({
    [TokenKeys.ACCESS_TOKEN_KEY]: z.string(),
    [TokenKeys.REFRESH_TOKEN_KEY]: z.string(),
  }),
);

// DTOs (- SignInDto, SignUpDto, SignInResponseDto: các lớp này được tạo từ schema bằng createZodDto.
//       - DTOs này được sử dụng trong controller/service để đảm bảo dữ liệu request/response tuân thủ đúng kiểu.)
class SignInDto extends createZodDto(SignInSchema) {}
class SignUpDto extends createZodDto(SignUpSchema) {}
class SignInResponseDto extends createZodDto(SignInResponseSchema) {}

export { SignInDto, SignUpDto, SignInResponseDto };
