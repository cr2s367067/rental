import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { ListQuery } from './common.contract';
export const metricDefinitions = {
  total_properties: {
    label: 'Properties',
    path: '/properties',
    description: 'Permitted properties',
  },
  total_resources: { label: 'Resources', path: '/resources', description: 'All rentable spaces' },
  occupied_resources: {
    label: 'Occupied resources',
    path: '/resources',
    description: 'At least one active contract',
  },
  available_resources: {
    label: 'Available resources',
    path: '/resources',
    description: 'No active contracts',
  },
  current_tenants: {
    label: 'Current tenants',
    path: '/tenants',
    description: 'Distinct current tenants',
  },
  upcoming_contract_starts: {
    label: 'Upcoming starts',
    path: '/stays',
    description: 'Next 7 calendar days',
  },
  upcoming_contract_ends: {
    label: 'Upcoming ends',
    path: '/stays',
    description: 'Next 7 calendar days',
  },
  unpaid_rent_periods: {
    label: 'Outstanding periods',
    path: '/payments',
    description: 'Any positive outstanding balance',
  },
  contracts_expiring: {
    label: 'Expiring contracts',
    path: '/contracts',
    description: 'Within the next 30 days',
  },
} as const;
export type MetricKey = keyof typeof metricDefinitions;
export class DashboardQuery extends PickType(ListQuery, [
  'property_id',
  'business_date',
] as const) {}
export class DashboardCounts {
  @ApiProperty() total_properties!: number;
  @ApiProperty() total_resources!: number;
  @ApiProperty() occupied_resources!: number;
  @ApiProperty() available_resources!: number;
  @ApiProperty() current_tenants!: number;
  @ApiProperty() upcoming_contract_starts!: number;
  @ApiProperty() upcoming_contract_ends!: number;
  @ApiProperty() unpaid_rent_periods!: number;
  @ApiProperty() contracts_expiring!: number;
  @ApiProperty({ type: String }) outstanding_twd!: string;
  @ApiProperty() document_metadata_count!: number;
}
export class DrillQuery {
  @ApiProperty({ format: 'date' }) business_date!: string;
  @ApiProperty({ enum: Object.keys(metricDefinitions) }) metric!: MetricKey;
  @ApiPropertyOptional() property_id?: string;
}
export class DashboardMetric {
  @ApiProperty({ enum: Object.keys(metricDefinitions) }) key!: MetricKey;
  @ApiProperty() label!: string;
  @ApiProperty() description!: string;
  @ApiProperty() count!: number;
  @ApiProperty({
    description: 'Frontend route; the generated SDK uses the corresponding domain API operation',
    enum: ['/properties', '/resources', '/tenants', '/stays', '/payments', '/contracts'],
  })
  path!: string;
  @ApiProperty({ type: DrillQuery }) query!: DrillQuery;
}
export class DashboardView {
  @ApiProperty({ format: 'date' }) business_date!: string;
  @ApiProperty() timezone!: string;
  @ApiProperty({ type: String, nullable: true }) property_id!: string | null;
  @ApiProperty({ type: DashboardCounts }) counts!: DashboardCounts;
  @ApiProperty({ type: [DashboardMetric] }) metrics!: DashboardMetric[];
}
