import { useMemo } from 'react';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { ActionVM, useActionVM } from './action.vm';
import { usersService, type UsersService } from '../Services/users.service';
import { queryClient } from '../Services/query';
import type * as DTO from '../Generated/types.gen';
export class UsersVM extends ActionVM {
  constructor(
    private service: UsersService,
    invalidate: () => Promise<unknown>,
  ) {
    super(invalidate);
  }
  create(input: DTO.CreateUserData['body']) {
    return this.run(() => this.service.create(input));
  }
  update(id: string, input: DTO.UpdateUserData['body']) {
    return this.run(() => this.service.update(id, input));
  }
  password(id: string, password: string) {
    return this.run(() => this.service.password(id, password));
  }
  grants(id: string, input: DTO.ReplacePropertyGrantsData['body']) {
    return this.run(() => this.service.grants(id, input));
  }
  owner(id: string, input: DTO.AssignPropertyOwnerData['body']) {
    return this.run(() => this.service.owner(id, input));
  }
  date(date: string) {
    return this.run(() => this.service.date(date));
  }
  reset() {
    return this.run(() => this.service.reset());
  }
}
export function useUsers(
  owner: boolean,
  service: UsersService = usersService,
  client: QueryClient = queryClient,
) {
  const query = useQuery(
    { queryKey: ['users'], queryFn: () => service.list(), enabled: owner },
    client,
  );
  const actions = useActionVM(
    useMemo(() => new UsersVM(service, () => client.invalidateQueries()), [service, client]),
  );
  return { query, actions };
}
