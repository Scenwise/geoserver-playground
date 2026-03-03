'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronsUpDownIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type Map = {
  id: number
  name: string
}

export function CompareMapDropdown({
  map,
  maps,
  paramKey,
}: {
  map: Map | null
  maps: Map[]
  paramKey: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  const handleMapChange = (value: string) => {
    router.replace(pathname + '?' + createQueryString(paramKey, value))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="lg">
          {map?.name ?? (
            <span className="text-muted-foreground">Select map</span>
          )}
          <ChevronsUpDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="center">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={map?.id.toString()}
            onValueChange={handleMapChange}
          >
            {maps.map((m) => (
              <DropdownMenuRadioItem key={m.id} value={m.id.toString()}>
                {m.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
