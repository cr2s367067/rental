import {PrismaClient} from '@prisma/client';
import {importFixtures} from '../Src/Infrastructure/fixture-import';
export const testDatabaseURL=process.env.TEST_DATABASE_URL || process.env.DATABASE_URL!.replace('/rental_demo','/rental_demo_test');
if(new URL(testDatabaseURL).pathname!=='/rental_demo_test') throw new Error('Tests require the isolated rental_demo_test database');
export const db=new PrismaClient({datasources:{db:{url:testDatabaseURL}}});
export const password=process.env.DEMO_PASSWORD!;
export async function fixtures(){await db.$transaction(tx=>importFixtures(tx,password),{timeout:30000});}
