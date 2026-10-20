import json,urllib.request,re,pathlib,time
ROOT=pathlib.Path.cwd();RUN=ROOT/'specs/001-property-management/qa/runs/qa-20261019-01'
def call(name,**arguments):
 req=urllib.request.Request('http://127.0.0.1:43891',data=json.dumps({'name':name,'arguments':arguments}).encode(),headers={'Content-Type':'application/json'})
 d=json.load(urllib.request.urlopen(req,timeout=240))
 if 'error' in d:raise RuntimeError(d['error'])
 r=d['result'];s='\n'.join(c.get('text','') for c in r.get('content',[]) if c.get('type')=='text')
 if r.get('isError'):raise RuntimeError(s or json.dumps(r))
 return s

def ev(page,fn):
 s=call('evaluate_script',pageId=page,function=fn)
 m=re.search(r'```json\s*([\s\S]*?)\s*```',s)
 if not m:raise RuntimeError(s)
 return json.loads(m[1])
def snap(page):return call('take_snapshot',pageId=page)
def uid(s,kind,label):
 m=re.search(r'uid=(\S+) '+re.escape(kind)+' "'+re.escape(label)+'"',s)
 if not m:raise RuntimeError('Missing '+kind+':'+label+'\n'+s)
 return m[1]
def click(page,kind,label):call('click',pageId=page,uid=uid(snap(page),kind,label))
def fill(page,kind,label,value):call('fill',pageId=page,uid=uid(snap(page),kind,label),value=value)
def nav(page,path):
 call('navigate_page',pageId=page,type='url',url='http://localhost:5173/#'+path)
 time.sleep(.5)
def login(role):
 s=call('new_page',url='http://localhost:5173',isolatedContext='qa-'+role)
 page=int(re.search(r'^(\d+):.*\[selected\]',s,re.M).group(1));ss=snap(page)
 call('fill_form',pageId=page,elements=[{'uid':uid(ss,'textbox','Email'),'value':role+'@example.test'},{'uid':uid(ss,'textbox','Password'),'value':'__DEMO_PASSWORD__'}]);click(page,'button','Sign in')
 time.sleep(.5);assert 'heading "Overview"' in snap(page);return page
