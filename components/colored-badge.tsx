import { Badge } from './ui/badge';

interface ColoredBadgeProps extends React.ComponentProps<typeof Badge> {}

export function ColoredBadge({
  children,
  className = '',
  ...props
}: ColoredBadgeProps) {
  return (
    <Badge
      className={`bg-purple-100 text-purple-700  dark:bg-purple-900 dark:text-purple-300 ${className}`}
      {...props}
    >
      {children}
    </Badge>
  );
}
