import type { ReactNode } from 'react';
export function ResponsiveTable({
  label,
  headings,
  children,
}: {
  label: string;
  headings: string[];
  children: ReactNode;
}) {
  return (
    <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table>
        <thead>
          <tr>
            {headings.map((h) => (
              <th scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
