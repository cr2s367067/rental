import { Injectable } from '@nestjs/common';
@Injectable()
export class Config {
  readonly databaseURL = process.env.DATABASE_URL || '';
  readonly redisURL = process.env.REDIS_URL || '';
  readonly origin = process.env.APP_ORIGIN || 'http://localhost:5173';
  readonly isolated = process.env.DEMO_ISOLATED === 'true';
  readonly demoDatabase = process.env.DEMO_DATABASE || '';
  readonly environment = process.env.NODE_ENV || 'development';
  readonly demo = process.env.DEMO_MODE === 'true';
  readonly namespace = 'rental:' + new URL(this.databaseURL).pathname + ':';
  constructor() {
    if (!/^postgres(ql)?:/.test(this.databaseURL) || !/^rediss?:/.test(this.redisURL))
      throw new Error('DATABASE_URL and REDIS_URL are required');
    if (new URL(this.origin).origin !== this.origin)
      throw new Error('APP_ORIGIN must be an origin');
    if (process.env.NODE_ENV === 'production' && !this.origin.startsWith('https://'))
      throw new Error('Production requires HTTPS');
  }
}
