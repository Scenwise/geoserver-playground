import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { geoserverMapLayers } from '@/lib/db/schema/geoserver'
import { safeJson } from '@/lib/safe-json'
import {
  GitCommitIcon,
  PenIcon,
  SplineIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { GeoserverLayerForm } from './forms/goeserver-layer-form'
import { Button } from '@/components/ui/button'

type Layer = typeof geoserverMapLayers.$inferSelect

export async function FeatureCountBadge({ layer }: { layer: Layer }) {
  const BadgeIcon = {
    nodes: GitCommitIcon,
    edges: SplineIcon,
  }[layer.type]

  const response = await fetch(
    `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer.layerId}&outputFormat=application/json&maxFeatures=1`,
  )
  const { json, error } = await safeJson(response)

  const isSuccess = response.ok && !error

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Tooltip>
          <TooltipTrigger>
            <BadgeIcon />
          </TooltipTrigger>
          <TooltipContent>
            <pre>{JSON.stringify(json, null, 2)}</pre>
          </TooltipContent>
        </Tooltip>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{layer.name}</ItemTitle>
        <ItemDescription>
          Source: {layer.source}, type: {layer.type}
        </ItemDescription>
      </ItemContent>
      {layer.source !== 'custom' && (
        <ItemContent className="flex-none">
          {isSuccess ? (
            <ItemDescription>{json?.totalFeatures} features</ItemDescription>
          ) : (
            <ItemDescription className="text-destructive">
              {!response.ok ? 'Could not load features' : 'Layer not found'}
              <TriangleAlertIcon className="inline align-middle size-3 ml-1" />
            </ItemDescription>
          )}
        </ItemContent>
      )}

      <GeoserverLayerForm data={layer}>
        <Button variant="secondary">
          <PenIcon />
        </Button>
      </GeoserverLayerForm>
    </Item>
  )
}
