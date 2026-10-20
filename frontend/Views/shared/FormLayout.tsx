import type { ReactNode } from 'react';
import { useId, isValidElement, cloneElement } from 'react';
export function FormLayout({ children }: { children: ReactNode }) {
  return <div className="form-grid">{children}</div>;
}
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="field">
      <label id={id + '-label'} htmlFor={id}>
        {label}
      </label>
      {isValidElement<{ id?: string; 'aria-labelledby'?: string }>(children)
        ? cloneElement(children, { id, 'aria-labelledby': id + '-label' })
        : children}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export function Feedback({ error, pending }: { error?: string; pending?: boolean }) {
  return (
    <>
      {pending && <p role="status">Loading…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
