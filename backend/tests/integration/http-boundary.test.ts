import {test,expect,beforeAll,beforeEach,afterAll} from 'bun:test';import {httpServer,origin} from '../http';
let api:Awaited<ReturnType<typeof httpServer>>;beforeAll(async()=>{api=await httpServer();});beforeEach(async()=>api.reset());afterAll(async()=>{await api.close();const logs=await api.logs();expect(logs).not.toContain('owner@example.test');expect(logs).not.toContain(process.env.DEMO_PASSWORD!);});
test('HTTP session cookie security, invalid fields, origin/CSRF, logout and safe errors',async()=>{
 expect((await api.request('/session',{},'GET')).status).toBe(401);
 expect((await api.request('/session',{origin,'Content-Type':'application/json'},'POST',{email:'bad',password:'x',role:'OWNER'})).status).toBe(400);
 const h=await api.login();const s=await api.request('/session',h);expect(s.status).toBe(200);expect(s.body.user.role).toBe('OWNER');expect(s.body.properties.length).toBe(4);expect(s.body.business_date).toBe('2026-10-19');expect(JSON.stringify(s.body)).not.toContain('password_hash');
 expect((await api.request('/session',{...h,origin:'https://evil.example'},'DELETE')).status).toBe(403);expect((await api.request('/session',{...h,'x-csrf-token':'wrong'},'DELETE')).status).toBe(403);
 expect((await api.request('/session',h,'DELETE')).status).toBe(200);expect((await api.request('/session',h)).status).toBe(401);
});
test('HTTP login and principal limits return429 with Retry-After',async()=>{
 const h=await api.login();for(let n=0;n<120;n++)expect((await api.request('/session',h)).status).toBe(200);const limited=await api.request('/session',h);expect(limited.status).toBe(429);expect(Number(limited.headers.get('retry-after'))).toBeGreaterThan(0);
 for(let n=1;n<10;n++)expect((await api.request('/session',{origin,'Content-Type':'application/json'},'POST',{email:'bad@example.test',password:'bad'})).status).toBe(401);
 const r=await api.request('/session',{origin,'Content-Type':'application/json'},'POST',{email:'bad@example.test',password:'bad'});expect(r.status).toBe(429);expect(r.headers.get('retry-after')).toBeTruthy();
});
