import { cn } from '@/lib/utils'

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('min-h-svh flex flex-col pt-12 pb-4 space-y-8', className)}
    >
      {children}
    </div>
  )
}

export function PageContent({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <div className={cn('px-4', className)}>{children}</div>
}
