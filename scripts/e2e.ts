import {spawn} from 'bun';
if(!process.env.DEMO_PASSWORD)throw new Error('Configure private DEMO_PASSWORD before browser checks');
const child=spawn(['bunx','playwright','test',...process.argv.slice(2)],{env:process.env,stdout:'inherit',stderr:'inherit'});for(const signal of ['SIGTERM','SIGINT'] as const)process.on(signal,()=>child.kill(signal));process.exit(await child.exited);
