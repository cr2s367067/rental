import {Injectable} from '@nestjs/common';import {Access,Actor} from '../Src/Infrastructure/access';import {Database} from '../Src/Infrastructure/database';import {Config} from '../Src/Infrastructure/config';
@Injectable()
export class SessionManager {
 constructor(private db:Database,private access:Access,private config:Config){}
 async date(){
  if(this.config.demo)return (await this.db.demoContext.findUnique({where:{id:'singleton'}}))?.business_date.toISOString().slice(0,10)||'2026-10-19';
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return ['year','month','day'].map(k=>parts.find(p=>p.type===k)!.value).join('-');
 }
 async view(actor:Actor,csrf_token:string){
  actor=await this.access.current(actor);const user=await this.db.user.findUniqueOrThrow({where:{id:actor.id},select:{id:true,email:true,display_name:true,role:true}});
  const properties=await this.db.property.findMany({where:actor.role==='OWNER'?{}:{id:{in:actor.property_ids}},select:{id:true,name:true,owner_user_id:true,version:true},orderBy:{id:'asc'}});
  return {user,properties,csrf_token,business_date:await this.date(),timezone:'Asia/Taipei',demo_mode:this.config.demo};
 }
}
