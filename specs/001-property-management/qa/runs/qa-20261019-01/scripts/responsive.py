from importlib.machinery import SourceFileLoader
m=SourceFileLoader('m','/tmp/rental-qa-client.py').load_module();import json,os,shutil
p=2;out=[]
# Existing Owner context has no stored manual preference. Follow both system values.
m.nav(p,'/');m.fill(p,'combobox','Theme','System')
for theme in ['light','dark']:
 m.call('emulate',pageId=p,colorScheme=theme);got=m.ev(p,'()=>({theme:document.documentElement.dataset.theme,pref:localStorage.getItem("rental-theme")})');assert got['theme']==theme and got['pref']=='system',got
m.fill(p,'combobox','Theme','Light');m.call('navigate_page',pageId=p,type='reload');m.time.sleep(.3);assert m.ev(p,'()=>({theme:document.documentElement.dataset.theme,pref:localStorage.getItem("rental-theme")})')=={'theme':'light','pref':'light'}
for category,w,h in [('mobile',390,844),('tablet',768,1024),('laptop',1366,768),('desktop',1920,1080)]:
 for theme in ['light','dark']:
  m.call('emulate',pageId=p,viewport=f'{w}x{h}x1'+(',mobile,touch' if category=='mobile' else ''),colorScheme=theme);m.nav(p,'/');m.fill(p,'combobox','Theme',theme.capitalize())
  def measure():return m.ev(p,"()=>({width:innerWidth,height:innerHeight,pageWidth:document.documentElement.scrollWidth,theme:document.documentElement.dataset.theme,nav:[...document.querySelectorAll('nav[aria-label=\"Main navigation\"] a')].map(x=>x.innerText),date:document.querySelector('header')?.innerText})")
  a=measure();assert a['width']==w and a['height']==h and a['pageWidth']<=w and a['theme']==theme and len(a['nav'])==11,a
  name=category+'-'+theme+'-overview.png';temp=os.environ['TMPDIR']+'rental-qa-'+name;m.call('take_screenshot',pageId=p,filePath=temp);shutil.copy(temp,m.RUN/'screenshots'/name)
  m.nav(p,'/properties/P001');m.click(p,'button','Edit property');b=m.ev(p,"()=>{const d=document.querySelector('[role=dialog]'),r=d.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,inputs:d.querySelectorAll('input').length,save:[...d.querySelectorAll('button')].some(x=>x.innerText==='Save property'),theme:document.documentElement.dataset.theme,pageWidth:document.documentElement.scrollWidth}}")
  assert b['left']>=0 and b['right']<=w+1 and b['top']>=0 and b['bottom']<=h+1 and b['save'] and b['inputs']==3 and b['pageWidth']<=w,b
  name=category+'-'+theme+'-form.png';temp=os.environ['TMPDIR']+'rental-qa-'+name;m.call('take_screenshot',pageId=p,filePath=temp);shutil.copy(temp,m.RUN/'screenshots'/name);m.click(p,'button','Close dialog')
  out.append({'category':category,'viewport':[w,h],'theme':theme,'overview':a,'edit_dialog':b,'status':'PASS'});print(category,theme,'PASS',flush=True)
(m.RUN/'mcp-responsive.json').write_text(json.dumps({'system_light_dark':'PASS','manual_return_visit_persistence':'PASS','cases':out},indent=2)+'\n')
