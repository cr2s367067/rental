import { getDashboard } from '../Generated/sdk.gen';
import type { GetDashboardData } from '../Generated/types.gen';
export const dashboardService = {
  async read(query: GetDashboardData['query'] = {}) {
    return (await getDashboard({ query, throwOnError: true })).data;
  },
};
export type DashboardService = typeof dashboardService;
