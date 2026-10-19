import {Injectable,OnModuleDestroy} from '@nestjs/common';
import Redis from 'ioredis';
import {Config} from './config';
@Injectable()
export class TemporaryStore implements OnModuleDestroy {
  readonly client:Redis;
  constructor(readonly config:Config){this.client=new Redis(config.redisURL,{keyPrefix:config.namespace,maxRetriesPerRequest:1});}
  async onModuleDestroy(){await this.client.quit();}
  async limit(key:string,max:number){
    const count=Number(await this.client.eval("local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],60) end;return n",1,'rate:'+key));
    const ttl=await this.client.ttl('rate:'+key);return {allowed:count<=max,retryAfter:Math.max(1,ttl)};
  }
}
