import { Module } from '@nestjs/common';
import { MailUtilService } from './mail-util.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailEnvs, MailTemplate } from './mail-util.const';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // (Kết nối đến máy chủ thư)
        transport: {
          host: configService.get(MailEnvs.MAIL_HOST),
          port: configService.get(MailEnvs.MAIL_PORT),
          ignoreTLS: false,
          secure: false,
          auth: {
            user: configService.get(MailEnvs.MAIL_INCOMING_USER),
            pass: configService.get(MailEnvs.MAIL_INCOMING_PASS),
          },
        },
        defaults: {
          from: `"${MailTemplate.MAIL_NAME_DEFAULT}" <${MailTemplate.MAIL_DEFAULT}>`,
        },
        template: {
          dir: __dirname + MailTemplate.TEMPLATES_PATH,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailUtilService],
  exports: [MailUtilService],
})
export class MailUtilModule {}
