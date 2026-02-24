export function MapContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl basis-0 grow overflow-hidden shadow-xl bg-card ring-4 ring-white dark:ring-white/10 ${className}`}
    >
      {children}
    </div>
  );
}
