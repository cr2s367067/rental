from importlib.machinery import SourceFileLoader
m=SourceFileLoader('m','/tmp/rental-qa-client.py').load_module();import json,datetime,pathlib,urllib.parse
f=json.load(open('specs/001-property-management/mock-data/fixtures.json'));g=json.load(open('specs/001-property-management/mock-data/expected-results.json'));date=f['as_of_date'];out=[]
for role,user,page in [('owner','U001',2),('manager','U002',3),('viewer','U003',4)]:
 scope={p['id'] for p in f['properties']} if role=='owner' else {a['property_id'] for a in f['property_access'] if a['user_id']==user}
 resources=[r for r in f['resources'] if r['property_id'] in scope];cs=[c for c in f['contracts'] if c['property_id'] in scope];end=lambda c:min(c['end_date'],c['termination_date'] or c['end_date']);current=[c for c in cs if c['start_date']<=date<end(c)];occupied={c['resource_id'] for c in current};add=lambda n:(datetime.date.fromisoformat(date)+datetime.timedelta(days=n)).isoformat();net=lambda o:sum((1 if p['kind']=='PAYMENT' else -1)*int(p['amount_twd']) for p in f['payments'] if p['obligation_id']==o['id'])
 expected={'total_properties':sorted(scope),'total_resources':sorted(r['id'] for r in resources),'occupied_resources':sorted(occupied),'available_resources':sorted(r['id'] for r in resources if r['id'] not in occupied),'current_tenants':sorted({c['tenant_id'] for c in current}),'upcoming_contract_starts':sorted(c['id'] for c in cs if date<c['start_date']<=add(7) and c['start_date']<end(c)),'upcoming_contract_ends':sorted(c['id'] for c in cs if date<end(c)<=add(7) and c['start_date']<end(c)),'unpaid_rent_periods':sorted(o['id'] for o in f['obligations'] if o['contract_id'] in {c['id'] for c in cs} and int(o['amount_due_twd'])>net(o)),'contracts_expiring':sorted(c['id'] for c in current if date<end(c)<=add(30))}
 m.nav(page,'/');data=m.ev(page,"async()=>{const r=await fetch('/api/dashboard');return {status:r.status,data:await r.json()}}")
 assert data['status']==200 and data['data']['counts']==g['dashboard_by_user'][user],data
 links=m.ev(page,"()=>[...document.querySelectorAll('[aria-label=\"Operational metrics\"] a')].map(a=>({label:a.getAttribute('aria-label'),url:a.href}))")
 assert len(links)==9
 for link in links:
  key=urllib.parse.parse_qs(urllib.parse.urlparse(link['url'].split('#')[1]).query)['metric'][0]
  m.click(page,'link',link['label']);m.time.sleep(.2)
  text=m.ev(page,'()=>document.querySelector("main").innerText')
  path=urllib.parse.urlparse(link['url'].split('#')[1]).path;api='/obligations' if path=='/payments' else path
  fn="async()=>{let ids=[],total;for(let page=1;page<20;page++){const r=await fetch('/api"+api+"?business_date=2026-10-19&metric="+key+"&page_size=2&page='+page);const d=await r.json();if(r.status!==200)throw Error(r.status);total=d.total;ids.push(...d.items.map(x=>x.id));if(ids.length>=total)break;}return {ids:ids.sort(),total}}"
  actual=m.ev(page,fn);assert actual['ids']==expected[key],(role,key,actual,expected[key]);assert actual['total']==len(expected[key]);labels={v['id']:v.get('name',v.get('contract_id',v['id'])) for table in ['properties','resources','tenants','contracts','obligations'] for v in f[table]};assert all(labels[i] in text for i in expected[key]),(role,key,'UI records missing',text);assert m.ev(page, '()=>document.querySelectorAll("main tbody tr").length')==len(expected[key])
  out.append({'role':role,'metric':key,'expected_ids':expected[key],'actual_ids':actual['ids'],'ui_full_set_visible':True,'api_page_size':2,'status':'PASS'})
  m.nav(page,'/')
 print(role,'all11goldenfields +9fullsets PASS',flush=True)
(m.RUN/'mcp-golden.json').write_text(json.dumps(out,indent=2)+'\n')
