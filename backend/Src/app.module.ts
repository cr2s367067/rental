import { DemoFixtures } from './Infrastructure/demo-fixtures';
import { DashboardManager } from '../Managers/dashboard-manager';
import { DashboardLogic } from './Handler/dashboard-logic';
import { BillingManager } from '../Managers/billing-manager';
import { PaymentsManager } from '../Managers/payments-manager';
import { PaymentsLogic } from './Handler/payments-logic';
import { ContractsManager } from '../Managers/contracts-manager';
import { DocumentsManager } from '../Managers/documents-manager';
import { ContractsLogic } from './Handler/contracts-logic';
import { DocumentsLogic } from './Handler/documents-logic';
import { TenantsManager } from '../Managers/tenants-manager';
import { StaysManager } from '../Managers/stays-manager';
import { TenantsLogic } from './Handler/tenants-logic';
import { StaysLogic } from './Handler/stays-logic';
import { RecordsManager } from '../Managers/records-manager';
import { PropertiesManager } from '../Managers/properties-manager';
import { PropertiesLogic } from './Handler/properties-logic';
import { ResourcesLogic } from './Handler/resources-logic';
import { UsersManager } from '../Managers/users-manager';
import { DemoManager } from '../Managers/demo-manager';
import { UsersLogic } from './Handler/users-logic';
import { PropertyAccessLogic } from './Handler/property-access-logic';
import { DemoLogic } from './Handler/demo-logic';
import { Module, Controller, Get } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Database } from './Infrastructure/database';
import { TemporaryStore } from './Infrastructure/redis';
import { Config } from './Infrastructure/config';
import { Access } from './Infrastructure/access';
import { AccessGuard } from './Infrastructure/transport';
import { SessionManager } from '../Managers/session-manager';
import { SessionLogic } from './Handler/session-logic';
@Controller('health')
class Health {
  constructor(
    private db: Database,
    private store: TemporaryStore,
  ) {}
  @Get() async health() {
    await this.db.$queryRaw`SELECT 1`;
    await this.store.client.ping();
    return { status: 'ok' };
  }
}
@Module({
  controllers: [
    DashboardLogic,
    PaymentsLogic,
    ContractsLogic,
    DocumentsLogic,
    TenantsLogic,
    StaysLogic,
    Health,
    SessionLogic,
    UsersLogic,
    PropertyAccessLogic,
    DemoLogic,
    PropertiesLogic,
    ResourcesLogic,
  ],
  providers: [
    DemoFixtures,
    DashboardManager,
    BillingManager,
    PaymentsManager,
    ContractsManager,
    DocumentsManager,
    TenantsManager,
    StaysManager,
    Config,
    Database,
    TemporaryStore,
    Access,
    SessionManager,
    RecordsManager,
    PropertiesManager,
    UsersManager,
    DemoManager,
    { provide: APP_GUARD, useClass: AccessGuard },
  ],
})
export class AppModule {}
