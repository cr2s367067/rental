import subprocess,json,threading,queue,http.server,pathlib,os,re,datetime
root=pathlib.Path.cwd(); out=root/'specs/001-property-management/qa/runs/qa-20261019-01'; env={}
for line in (root/'.env').read_text().splitlines():
 if '=' in line and not line.startswith('#'):
  k,v=line.split('=',1);env[k]=v.strip().strip('"').strip("'")
secret=env['DEMO_PASSWORD']; proc=subprocess.Popen(['npx','-y','chrome-devtools-mcp@1.11.0','--isolated','--headless','--no-usage-statistics','--no-performance-crux'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,bufsize=1)
q=queue.Queue();threading.Thread(target=lambda:[q.put(x) for x in proc.stdout],daemon=True).start();counter=0;lock=threading.Lock()
def clean(x):
 s=json.dumps(x,ensure_ascii=False).replace(secret,'[REDACTED]')
 s=re.sub(r'(?i)(rental_sid=)[^;\\\s"]+',r'\1[REDACTED]',s)
 return json.loads(s)
def rpc(method,params):
 global counter
 counter+=1; i=counter;proc.stdin.write(json.dumps({'jsonrpc':'2.0','id':i,'method':method,'params':params})+'\n');proc.stdin.flush()
 while True:
  s=q.get(timeout=180)
  try:r=json.loads(s)
  except:continue
  if r.get('id')==i:return r
init=rpc('initialize',{'protocolVersion':'2025-03-26','capabilities':{},'clientInfo':{'name':'rental-independent-qa','version':'1'}})
proc.stdin.write(json.dumps({'jsonrpc':'2.0','method':'notifications/initialized'})+'\n');proc.stdin.flush();listing=rpc('tools/list',{})
(out/'mcp-initialize.json').write_text(json.dumps(clean(init),indent=2)+'\n');(out/'mcp-tools.json').write_text(json.dumps(listing,indent=2)+'\n')
class H(http.server.BaseHTTPRequestHandler):
 def log_message(self,*a):pass
 def do_POST(self):
  body=json.loads(self.rfile.read(int(self.headers['content-length'])));safe=clean(body)
  body=json.loads(json.dumps(body).replace('__DEMO_PASSWORD__',secret))
  with lock:
   r=rpc('tools/call',body);r=clean(r)
   with (out/'mcp-calls.jsonl').open('a') as f:f.write(json.dumps({'time':datetime.datetime.now(datetime.timezone.utc).isoformat(),'call':safe,'response':r},ensure_ascii=False)+'\n')
  data=json.dumps(r).encode();self.send_response(200);self.end_headers();self.wfile.write(data)
print('MCP initialized; tools='+str(len(listing['result']['tools']))+'; bridge127.0.0.1:43891',flush=True)
http.server.HTTPServer(('127.0.0.1',43891),H).serve_forever()
