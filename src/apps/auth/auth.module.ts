import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTEnvs } from './consts/jwt.const';
import { UsersModule } from '../users/users.module';
import { StringUtilModule } from 'src/common/utils/string-util/string-util.module';
import { ConfigService } from '@nestjs/config';
import { MailUtilService } from 'src/common/utils/mail-util/mail-util.service';
import { StringUtilService } from 'src/common/utils/string-util/string-util.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>(JWTEnvs.JWT_SECRET),
      }),
    }),
    UsersModule,
    StringUtilModule,
  ],
  providers: [AuthService, MailUtilService, StringUtilService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
