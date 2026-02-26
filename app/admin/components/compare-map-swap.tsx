'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeftRightIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function CompareMapSwap() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const swapMaps = () => {
    const params = new URLSearchParams(searchParams.toString())
    const [map1, map2] = [searchParams.get('map1'), searchParams.get('map2')]
    if (map2) params.set('map1', map2)
    if (map1) params.set('map2', map1)
    router.replace(pathname + '?' + params.toString())
  }

  return (
    <Button variant="secondary" onClick={swapMaps}>
      <ArrowLeftRightIcon />
      Swap maps
    </Button>
  )
}
