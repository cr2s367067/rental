from pathlib import Path
import json,hashlib,subprocess,sys
f=Path('specs/001-property-management'); p=f/'handoff.json'; h=json.loads(p.read_text()); task=next(t for t in h['tasks'] if t['id']==sys.argv[2])
state=json.loads(subprocess.check_output(['uv','run','--script','.codex/agents/qa-agent/skills/qa-agent/scripts/qa_state.py','status']))
if state['halted']: raise SystemExit('HALTED')
if sys.argv[1]=='start':
 assert all(next(x for x in h['tasks'] if x['id']==d)['status']=='done' for d in task['dependencies']),task['dependencies']
 task['status']='in_progress'
else:
 assert task['status']=='in_progress',task['status']
 task['status']='done'; text=(f/'tasks.md').read_text().replace('- [ ] '+task['id']+' ','- [x] '+task['id']+' '); (f/'tasks.md').write_text(text)
 text=(f/'coding-tasks.md').read_text()
 for n in ['01','02','03']: text=text.replace('- [ ] '+task['id']+'-S'+n, '- [x] '+task['id']+'-S'+n)
 (f/'coding-tasks.md').write_text(text)
 evidence=' '.join(sys.argv[3:]);
 with (f/'coding-report.md').open('a') as out: out.write('\n- '+task['id']+': '+evidence+'\n')
 with (f/'handoff.md').open('a') as out: out.write('\nCoding evidence '+task['id']+': '+evidence+'\n')
for t in h['tasks']:
 if t['status'] in ['ready','waiting']: t['status']='ready' if all(next(x for x in h['tasks'] if x['id']==d)['status']=='done' for d in t['dependencies']) else 'waiting'
h['artifact_hashes']['specs/001-property-management/tasks.md']=hashlib.sha256((f/'tasks.md').read_bytes()).hexdigest(); p.write_text(json.dumps(h,indent=2)+'\n')
print(task['id'],task['status'],state['retry_count'])
