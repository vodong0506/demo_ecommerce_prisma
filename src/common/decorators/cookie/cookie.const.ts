import { CookieOptions } from 'express';
import { JWTToken } from 'src/apps/auth/consts/jwt.const';

// (Mapping lại thời gian hết hạn JWT sang cookie)
enum CookiesToken {
  ACCESS_TOKEN_EXPIRE_IN = JWTToken.ACCESS_TOKEN_EXPIRE_IN,
  REFRESH_TOKEN_EXPIRE_IN = JWTToken.REFRESH_TOKEN_EXPIRE_IN,
}

// (cấu hình mặc định cho cookie)
const COOKIE_CONFIG_DEFAULT: CookieOptions = {
  httpOnly: true, // (Cookie không thể đọc bằng JavaScript, chống XSS)
  sameSite: 'strict', // (Cookie chỉ gửi khi request cùng domain)
};

export { CookiesToken, COOKIE_CONFIG_DEFAULT };
