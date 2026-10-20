import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUsers, type UsersVM } from '../VMs/users.vm';
import { userFormSchema, type UserFormValues, type UserView } from '../Models/user';
import type { SessionView } from '../Generated/types.gen';
import { Button } from './shared/Button';
import { ResponsiveDialog } from './shared/ResponsiveDialog';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { FormLayout, Field, Feedback } from './shared/FormLayout';
import { errorMessage } from '../Services/client';
import { StatusBadge } from './shared/StatusBadge';
function UserForm({ user, vm, done }: { user: UserView | null; vm: UsersVM; done: () => void }) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema(!user)),
    defaultValues: {
      email: user?.email || '',
      display_name: user?.display_name || '',
      role: user?.role || 'VIEWER',
      enabled: user?.enabled ?? true,
      password: '',
    },
  });
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        const { password, ...fields } = values;
        const saved = user
          ? await vm.update(user.id, { ...fields, version: user.version })
          : await vm.create({ ...fields, password });
        if (saved) done();
      })}
    >
      <FormLayout>
        <Field label="Display name" error={errors.display_name?.message}>
          <input {...register('display_name')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register('email')} />
        </Field>
        <Field label="Role">
          <select {...register('role')}>
            <option value="OWNER">Owner</option>
            <option value="MANAGER">Manager</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </Field>
        <Field label="Enabled">
          <input type="checkbox" {...register('enabled')} />
        </Field>
        {!user && (
          <Field label="Password" error={errors.password?.message}>
            <input type="password" autoComplete="new-password" {...register('password')} />
          </Field>
        )}
      </FormLayout>
      <Feedback error={vm.error} />
      <div className="form-actions">
        <Button type="submit" disabled={vm.pending}>
          Save user
        </Button>
      </div>
    </form>
  );
}
function PasswordForm({ id, vm, done }: { id: string; vm: UsersVM; done: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>();
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        if (await vm.password(id, v.password)) done();
      })}
    >
      <Field label="New password" error={errors.password?.message}>
        <input
          type="password"
          autoComplete="new-password"
          {...register('password', {
            required: true,
            minLength: { value: 12, message: 'Use at least 12 characters' },
          })}
        />
      </Field>
      <Feedback error={vm.error} />
      <Button disabled={vm.pending}>Reset password</Button>
    </form>
  );
}
export function Users({ session }: { session: SessionView }) {
  const { query, actions } = useUsers(session.user.role === 'OWNER');
  const [editing, setEditing] = useState<UserView | null | undefined>(),
    [passwordUser, setPasswordUser] = useState<UserView>();
  if (session.user.role !== 'OWNER') return <p role="alert">Owner access required</p>;
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">WORKSPACE ACCESS</p>
          <h1>Users</h1>
          <p>Manage roles and keep access aligned with responsibilities.</p>
        </div>
        <Button onClick={() => setEditing(null)}>Add user</Button>
      </div>
      <Feedback pending={query.isPending} error={query.error ? errorMessage(query.error) : ''} />
      <div className="table-card">
        <ResponsiveTable label="Users" headings={['User', 'Role', 'Access', 'Actions']}>
          {query.data?.items.map((user) => (
            <tr key={user.id}>
              <td>
                <strong>{user.display_name}</strong>
                <small>{user.email}</small>
              </td>
              <td>{user.role}</td>
              <td>
                <StatusBadge status={user.enabled ? 'Enabled' : 'Disabled'} />
                <small>
                  {user.role === 'OWNER'
                    ? 'All properties'
                    : `${user.property_ids.length} granted properties`}
                </small>
              </td>
              <td>
                <div className="actions">
                  <Button variant="outline" onClick={() => setEditing(user)}>
                    Edit {user.display_name}
                  </Button>
                  <Button variant="ghost" onClick={() => setPasswordUser(user)}>
                    Password
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </ResponsiveTable>
      </div>
      <ResponsiveDialog
        open={editing !== undefined}
        onOpenChange={(open) => {
          if (!open) setEditing(undefined);
        }}
        title={editing ? 'Edit user' : 'Add user'}
        description="Changes to accounts, roles or grants end affected sessions."
      >
        {editing !== undefined && (
          <UserForm
            key={editing?.id || 'new'}
            user={editing}
            vm={actions}
            done={() => setEditing(undefined)}
          />
        )}
      </ResponsiveDialog>
      <ResponsiveDialog
        open={!!passwordUser}
        onOpenChange={(open) => {
          if (!open) setPasswordUser(undefined);
        }}
        title="Reset password"
      >
        {passwordUser && (
          <PasswordForm id={passwordUser.id} vm={actions} done={() => setPasswordUser(undefined)} />
        )}
      </ResponsiveDialog>
    </>
  );
}
