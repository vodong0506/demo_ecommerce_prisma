// (Đây là tên biến môi trường dùng để lưu secret key cho JWT.)
export enum JWTEnvs {
  JWT_SECRET = 'JWT_SECRET',
}

// ( kiểm soát vòng đời của token, đảm bảo bảo mật và buộc người dùng phải refresh định kỳ.)
export enum JWTToken {
  ACCESS_TOKEN_EXPIRE_IN = '6h',
  REFRESH_TOKEN_EXPIRE_IN = '1d',
}

// (chuẩn hóa key trong response, giúp frontend/backend thống nhất cách đọc dữ liệu.)
export enum TokenKeys {
  ACCESS_TOKEN_KEY = 'accessToken',
  REFRESH_TOKEN_KEY = 'refreshToken',
}
