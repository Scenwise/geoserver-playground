import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export function TabsCard({
  tabs,
  className,
  children,
  onValueChange,
}: {
  tabs: { label: string; value: string }[]
  className?: string
  children: React.ReactNode
  onValueChange?: (value: string) => void
}) {
  return (
    <Tabs
      defaultValue="streetview"
      onValueChange={onValueChange}
      className={cn(
        'w-full h-full bg-card shadow-centered overflow-hidden rounded-2xl gap-0',
        className,
      )}
    >
      <TabsList className="w-full p-0  rounded-none pb-7 h-16! -mb-7 overflow-hidden">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="shadow-none! rounded-b-none rounded-t-2xl pb-7 -mb-7 h-16"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="bg-card p-2 grow rounded-2xl! relative z-10 *:rounded-[calc(var(--radius-2xl)-8px)] *:size-full *:overflow-hidden">
        {children}
      </div>
    </Tabs>
  )
}