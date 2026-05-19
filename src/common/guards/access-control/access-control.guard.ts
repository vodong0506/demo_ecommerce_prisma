import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Actions } from './access-control.const';
import { Request } from 'express';
import { EnvVars } from '../../envs/validate.env';
import { IS_SKIP_AUTH } from 'src/apps/auth/auth.decorator';
import { UsersService } from 'src/apps/users/users.service';
import { User } from '@prisma/client';
import { RequestMethod } from '../../utils/api-util/api-util.const';

@Injectable()
// (phân quyền (authorization) - kiểm tra quyền của user)
export class AccessControlGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  // (Chuẩn hóa URL để tạo permission key)
  getCurrentRoute(req: Request) {
    const { path, params } = req;
    let basePath = path;
    for (const [key, value] of Object.entries(params)) {
      basePath = basePath.replace(value as string, `:${key}`); // (/api/users/3 → /api/users/:id)
    }
    return basePath.replace(this.configService.get(EnvVars.APP_PREFIX)!, ''); // (bỏ prefix /api -> /users/:id)
  }

  // (Kiểm tra user có quyền không)
  private async canAccessResources(userID: User['id'], permissionKey: string) {
    const isSupperAdmin = await this.usersService.isSuperAdmin(userID);
    if (isSupperAdmin) return true;

    const canAccess = await this.usersService.isExistPermissionKey({
      userID,
      permissionKey,
    });
    return canAccess;
  }

  // (Convert HTTP method → action)
  getAction(httpMethod: RequestMethod) {
    const actionsConverter = {
      [RequestMethod.GET]: Actions.READ,
      [RequestMethod.POST]: Actions.CREATE,
      [RequestMethod.PUT]: Actions.UPDATE,
      [RequestMethod.PATCH]: Actions.UPDATE,
      [RequestMethod.DELETE]: Actions.DELETE,
    };
    const action = actionsConverter[httpMethod];
    if (!action) throw new BadRequestException('Action not define!');
    return action;
  }

  // ( Hàm chính của Guard.)
  async canActivate(context: ExecutionContext) {
    // (Nếu API có decorator @SkipAuth() -> bỏ qua guard)
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(IS_SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isSkipAuth) {
      return true;
    }

    // (Lấy thông tin user từ request)
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const user = req['user'];
    if (!user) return false; // (chặn luôn nếu chưa login)
    // return true;
    // (check quyền)
    const route = this.getCurrentRoute(req);
    const action = this.getAction(req.method as unknown as RequestMethod);
    const canAccess = await this.canAccessResources(
      user!.userID as string,
      `[${route}]_[${action}]`, // (Tạo permissionKey vd: [/users/:id]_[READ])
    );
    return canAccess;
  }
}
