import { Dashboard } from './Dashboard';
import { Payments } from './Payments';
import { Contracts } from './Contracts';
import { Documents } from './Documents';
import { Tenants } from './Tenants';
import { Stays } from './Stays';
import { Properties } from './Properties';
import { Resources } from './Resources';
import { useRoute } from '../VMs/navigation.vm';
import { Users } from './Users';
import { PropertyAccess } from './PropertyAccess';
import { DemoContext } from './DemoContext';
import { useLayoutEffect } from 'react';
import { AppShell } from './AppShell';
import { useTheme } from '../VMs/theme.vm';
import './styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { useSession } from '../VMs/session.vm';
import { sessionService } from '../Services/client';
import type { SessionService } from '../Services/client';
import { queryClient } from '../Services/query';
import { SignIn } from './SignIn';
export function App({ service = sessionService }: { service?: SessionService }) {
  const route = useRoute();
  const vm = useSession(service, queryClient);
  const theme = useTheme();
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme.theme;
  }, [theme.theme]);
  return (
    <QueryClientProvider client={queryClient}>
      {vm.loading ? (
        <p role="status">Loading session…</p>
      ) : !vm.session ? (
        <SignIn vm={vm} />
      ) : (
        <AppShell
          session={vm.session}
          onSignOut={() => vm.signOut()}
          onRefresh={() => {
            void queryClient.invalidateQueries();
          }}
        >
          {route.path === '/payments' ? (
            <Payments session={vm.session} />
          ) : route.path === '/contracts' || route.path.startsWith('/contracts/') ? (
            <Contracts
              session={vm.session}
              id={
                route.path.startsWith('/contracts/')
                  ? decodeURIComponent(route.path.split('/')[2])
                  : undefined
              }
            />
          ) : route.path === '/documents' ? (
            <Documents session={vm.session} />
          ) : route.path === '/tenants' || route.path.startsWith('/tenants/') ? (
            <Tenants
              session={vm.session}
              id={
                route.path.startsWith('/tenants/')
                  ? decodeURIComponent(route.path.split('/')[2])
                  : undefined
              }
            />
          ) : route.path === '/stays' ? (
            <Stays session={vm.session} />
          ) : route.path === '/properties' || route.path.startsWith('/properties/') ? (
            <Properties
              session={vm.session}
              id={
                route.path.startsWith('/properties/')
                  ? decodeURIComponent(route.path.split('/')[2])
                  : undefined
              }
            />
          ) : route.path === '/resources' ? (
            <Resources session={vm.session} />
          ) : route.path === '/users' ? (
            <Users session={vm.session} />
          ) : route.path === '/property-access' ? (
            <PropertyAccess session={vm.session} />
          ) : route.path === '/demo' ? (
            <DemoContext session={vm.session} />
          ) : (
            <Dashboard session={vm.session} />
          )}
        </AppShell>
      )}
    </QueryClientProvider>
  );
}
