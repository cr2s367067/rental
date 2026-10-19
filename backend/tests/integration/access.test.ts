import {beforeEach,afterAll,test,expect} from 'bun:test';
import {fixtures,db,password} from '../fixtures';
import {Config} from '../../Src/Infrastructure/config';import {Database} from '../../Src/Infrastructure/database';import {TemporaryStore} from '../../Src/Infrastructure/redis';
import {Access} from '../../Src/Infrastructure/access';
const config=new Config();const store=new TemporaryStore(config);const access=new Access(db as Database,store);
beforeEach(fixtures);afterAll(async()=>{await store.onModuleDestroy();await db.$disconnect();});
test('valid credentials create an opaque Redis session with persisted role and grants',async()=>{
 const s=await access.login('manager@example.test',password);expect(s.actor.role).toBe('MANAGER');expect(s.actor.property_ids.sort()).toEqual(['P001','P002']);
 expect(s.id.length).toBeGreaterThan(32);expect((await access.authenticate(s.id)).actor.id).toBe('U002');
});
test('invalid credentials and stale/disabled sessions fail',async()=>{
 await expect(access.login('owner@example.test','wrong')).rejects.toThrow();const s=await access.login('owner@example.test',password);
 await db.user.update({where:{id:'U001'},data:{session_version:{increment:1}}});await expect(access.authenticate(s.id)).rejects.toThrow();
});
test('Owner, Manager and Viewer checks use server scope',()=>{
 const owner={id:'U001',role:'OWNER' as const,session_version:1,property_ids:[]};const manager={...owner,id:'U002',role:'MANAGER' as const,property_ids:['P001']};const viewer={...manager,id:'U003',role:'VIEWER' as const};
 expect(()=>access.property(owner,'P003')).not.toThrow();expect(()=>access.property(manager,'P001')).not.toThrow();expect(()=>access.property(manager,'P003')).toThrow();expect(()=>access.write(viewer)).toThrow();expect(()=>access.owner(manager)).toThrow();
});
