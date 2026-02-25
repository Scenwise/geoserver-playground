import { Badge } from '@/components/ui/badge';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { safeJson } from '@/lib/safe-json';
import { GitCommitIcon, SplineIcon, TriangleAlertIcon } from 'lucide-react';

export async function FeatureCountBadge({
  id,
  type,
}: {
  id: string;
  type: 'nodes' | 'edges';
}) {
  const BadgeIcon = {
    nodes: GitCommitIcon,
    edges: SplineIcon,
  }[type];

  const response = await fetch(
    `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json&maxFeatures=0`,
  );
  const { json, error } = await safeJson(response);

  const isSuccess = response.ok && !error;

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <BadgeIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="capitalize">{type}</ItemTitle>
        <ItemDescription>{id}</ItemDescription>
      </ItemContent>
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
    </Item>
  );
}
