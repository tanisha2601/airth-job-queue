import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'better-sqlite3' as any,
  database: 'data/jobs.sqlite',
  synchronize: true, // Auto-sync DB schema in development
  autoLoadEntities: true,
}));
