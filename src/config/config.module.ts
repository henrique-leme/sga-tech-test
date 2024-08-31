import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validatedEnv } from './env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [() => validatedEnv],
    }),
  ],
})
export class ConfigModule {}
