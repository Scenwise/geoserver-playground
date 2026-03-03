import { Badge } from './ui/badge'

export function ColoredBadge({
  children,
  className = '',
  ...props
}: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      className={`bg-purple-100 text-purple-700  dark:bg-purple-900 dark:text-purple-300 ${className}`}
      {...props}
    >
      {children}
    </Badge>
  )
}
