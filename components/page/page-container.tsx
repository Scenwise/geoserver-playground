import { cn } from '@/lib/utils';

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col pt-12 pb-4 space-y-8">
      {children}
    </div>
  );
}

export function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('px-4', className)}>{children}</div>;
}
