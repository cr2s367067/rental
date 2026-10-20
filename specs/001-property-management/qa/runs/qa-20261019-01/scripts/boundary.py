from importlib.machinery import SourceFileLoader
m=SourceFileLoader('m','/tmp/rental-qa-client.py').load_module();import json
out=[]
for role,page in [('manager',3),('viewer',4)]:
 fn="""async()=>{const s=await(await fetch('/api/session')).json();const checks=[];for(const [name,url,method,body] of CASES){const r=await fetch('/api'+url,{method,headers:{'Content-Type':'application/json','X-CSRF-Token':s.csrf_token},...(body?{body:JSON.stringify(body)}:{})});const x=await r.json();checks.push({name,status:r.status,error:x.message,noProtectedObject:!x.id&&!x.items&&!x.bytes&&!x.password_hash});}return checks}"""
 cases=[['role escalation','/users/U003','PATCH',{'version':1,'role':'OWNER'}],['users list','/users','GET',None],['unassigned contact','/tenants/TEN010','GET',None],['outscope property','/properties/P003','GET',None],['outscope documents','/documents?property_id=P003','GET',None],['document contents','/documents/DOC-C001/content','GET',None],['property write','/properties/P001','PATCH',{'version':1,'city':'Denied mutation'}]]
 if role=='manager':cases=[c for c in cases if c[0] not in ['document contents','property write']]+[['owner-only mode','/properties/P001','PATCH',{'version':1,'rental_mode':'ROOMS'}]]
 actual=m.ev(page,fn.replace('CASES',json.dumps(cases)));assert all(x['status']==403 and x['noProtectedObject'] for x in actual),actual;out.append({'role':role,'checks':actual})
 print(role,'directpermissionboundaries PASS')
(m.RUN/'mcp-permissions.json').write_text(json.dumps(out,indent=2)+'\n')
