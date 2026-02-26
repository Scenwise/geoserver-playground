export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between px-4">
      {children}
    </header>
  );
}

export function PageHeaderContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function PageHeaderTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">
      {children}
    </h1>
  );
}

export function PageHeaderDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-muted-foreground">{children}</p>;
}

export function PageHeaderActions({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 items-center">{children}</div>;
}
