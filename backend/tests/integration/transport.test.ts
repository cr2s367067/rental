import {test,expect,afterAll} from 'bun:test';
import {checkOrigin,checkCSRF,safeError} from '../../Src/Infrastructure/transport';
import {TemporaryStore} from '../../Src/Infrastructure/redis';import {Config} from '../../Src/Infrastructure/config';
const store=new TemporaryStore(new Config());afterAll(()=>store.onModuleDestroy());
test('mutations require exact Origin and session CSRF token',()=>{
 expect(()=>checkOrigin('https://evil.example','http://localhost:5173')).toThrow();expect(()=>checkOrigin(undefined,'http://localhost:5173')).toThrow();
 expect(()=>checkOrigin('http://localhost:5173','http://localhost:5173')).not.toThrow();expect(()=>checkCSRF(undefined,'secret')).toThrow();expect(()=>checkCSRF('different','secret')).toThrow();expect(()=>checkCSRF('secret','secret')).not.toThrow();
});
test('Redis rate windows implement login10 and authenticated120 with Retry-After',async()=>{
 for(const max of [10,120]){const key='transport-test-'+crypto.randomUUID();for(let n=0;n<max;n++)expect((await store.limit(key,max)).allowed).toBe(true);const result=await store.limit(key,max);expect(result.allowed).toBe(false);expect(result.retryAfter).toBeGreaterThan(0);expect(result.retryAfter).toBeLessThanOrEqual(60);}
});
test('safe errors contain actionable status without raw payload',()=>{expect(safeError(422,'Invalid dates')).toEqual({status_code:422,message:'Invalid dates'});});
