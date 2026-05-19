import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { kebabCase } from 'es-toolkit';
// import { kebabCase } from 'es-toolkit/compat';

@Injectable()
export class StringUtilService {
  // (dùng để lưu mật khẩu an toàn trong cơ sở dữ liệu.)
  async hash(value: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(value, salt);
  }

  // (xác thực mật khẩu khi người dùng đăng nhập.)
  async compare(value: string, valueHashed: string) {
    return await bcrypt.compare(value, valueHashed);
  }

  // (tạo mã OTP, token ngắn, hoặc chuỗi định danh ngẫu nhiên.)
  random(length = 6): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  // (chuẩn hóa chuỗi, ví dụ để tạo tên file hoặc key không chứa khoảng trắng.)
  removeSpace(value: string) {
    return value.replace(/\s+/g, '_');
  }

  toSlug(text: string): string {
    return kebabCase(
      text
        .normalize('NFD') // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .replace(/[đĐ]/g, 'd'), // chuyển đ -> d
    );
  }
}
