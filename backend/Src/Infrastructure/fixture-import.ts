import type {Prisma} from '@prisma/client';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const fixturePath = 'specs/001-property-management/mock-data/fixtures.json';
export async function importFixtures(tx:Prisma.TransactionClient,password:string){
  if(password.length<12) throw new Error('DEMO_PASSWORD must contain at least 12 characters');
  const f=JSON.parse(readFileSync(fixturePath,'utf8'));
  if(f.is_synthetic!==true || f.schema_version!==1) throw new Error('Invalid synthetic fixture');
  const hash=await Bun.password.hash(password,{algorithm:'argon2id'});
  // The caller enforces isolated database/reset policy. Clear the FK cycle first.
  await tx.contract.updateMany({data:{primary_document_id:null}});
  await tx.documentContent.deleteMany();await tx.document.deleteMany();await tx.idempotencyRecord.deleteMany();
  await tx.paymentRecord.deleteMany({where:{kind:'REVERSAL'}});await tx.paymentRecord.deleteMany();
  await tx.rentalObligation.deleteMany();await tx.contract.deleteMany();await tx.tenant.deleteMany();
  await tx.propertyAccess.deleteMany();await tx.resource.deleteMany();await tx.property.deleteMany();await tx.user.deleteMany();
  for(const row of f.users) await tx.user.create({data:{...row,password_hash:hash}});
  for(const row of f.properties) await tx.property.create({data:row});
  for(const row of f.resources) await tx.resource.create({data:row});
  for(const row of f.property_access) await tx.propertyAccess.create({data:row});
  for(const row of f.tenants) await tx.tenant.create({data:row});
  for(const row of f.contracts){const {property_id,document_id,...data}=row;
    if(f.resources.find((r:{id:string})=>r.id===data.resource_id)?.property_id!==property_id) throw new Error('Fixture property mismatch');
    await tx.contract.create({data:{...data,start_date:new Date(data.start_date),end_date:new Date(data.end_date),termination_date:data.termination_date?new Date(data.termination_date):null}});
  }
  for(const row of f.obligations) await tx.rentalObligation.create({data:{...row,period_start:new Date(row.period_start),period_end:new Date(row.period_end),due_date:new Date(row.due_date)}});
  for(const row of f.payments) await tx.paymentRecord.create({data:{...row,recorded_at:new Date(row.recorded_at)}});
  for(const row of f.documents){const {content_utf8,...data}=row;const bytes=Buffer.from(content_utf8,'utf8');
    if(bytes.length!==data.size_bytes || createHash('sha256').update(bytes).digest('hex')!==data.sha256) throw new Error('Fixture integrity mismatch');
    await tx.document.create({data:{...data,uploaded_at:new Date(data.uploaded_at),content:{create:{bytes}}}});
  }
  for(const row of f.contracts) await tx.contract.update({where:{id:row.id},data:{primary_document_id:row.document_id}});
  await tx.demoContext.upsert({where:{id:'singleton'},create:{id:'singleton',business_date:new Date(f.as_of_date)},update:{business_date:new Date(f.as_of_date)}});
}
