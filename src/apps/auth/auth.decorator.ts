import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_AUTH = 'IS_SKIP_AUTH';
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH, true); // (route này KHÔNG cần kiểm tra auth)

export const IS_SKIP_PERMISSION = 'IS_SKIP_USER_PROFILE';
export const SkipPermission = () => SetMetadata(IS_SKIP_PERMISSION, true); // (route này KHÔNG cần kiểm tra permission)
