import { cn } from '@/lib/utils'

export function MapContainer({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl basis-0 grow overflow-hidden shadow-centered bg-card border-4 border-white dark:ring-white/10',
        className,
      )}
    >
      {children}
    </div>
  )
}
