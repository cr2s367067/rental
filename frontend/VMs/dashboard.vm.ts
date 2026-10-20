import { link } from './navigation.vm';
import { useQuery, type QueryClient } from '@tanstack/react-query';
import { dashboardService, type DashboardService } from '../Services/dashboard.service';
import { queryClient } from '../Services/query';
import type { DashboardView, GetDashboardData } from '../Generated/types.gen';
export function metricLinks(
  view: DashboardView,
): { key: string; count: number; label: string; description: string; href: string }[] {
  return view.metrics.map((metric) => ({
    key: metric.key,
    count: metric.count,
    label: metric.label,
    description: metric.description,
    href: link(metric.path, {
      business_date: metric.query.business_date,
      property_id: metric.query.property_id,
      metric: metric.query.metric,
    }),
  }));
}
export function useDashboard(
  query: GetDashboardData['query'] = {},
  service: DashboardService = dashboardService,
  client: QueryClient = queryClient,
) {
  return useQuery({ queryKey: ['dashboard', query], queryFn: () => service.read(query) }, client);
}
