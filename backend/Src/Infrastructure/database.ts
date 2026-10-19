import {Injectable,OnModuleDestroy,OnModuleInit} from '@nestjs/common';
import {PrismaClient,Prisma} from '@prisma/client';
import {Config} from './config';
export type Tx=Prisma.TransactionClient;
@Injectable()
export class Database extends PrismaClient implements OnModuleInit,OnModuleDestroy {
  constructor(config:Config){super({datasources:{db:{url:config.databaseURL}},log:[]});}
  async onModuleInit(){await this.$connect();}
  async onModuleDestroy(){await this.$disconnect();}
}
export async function locks(tx:Tx,keys:string[]){
  for(const key of [...new Set(keys)].sort()) await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${key},0))`;
}
