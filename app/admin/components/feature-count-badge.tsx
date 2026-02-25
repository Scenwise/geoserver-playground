import { Badge } from '@/components/ui/badge';
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
    <Badge variant={isSuccess ? 'secondary' : 'destructive'}>
      {isSuccess ? <BadgeIcon /> : <TriangleAlertIcon />}
      {isSuccess ? `${json?.totalFeatures} ${type}` : `Could not load ${type}`}
      <span
        className={`text-2xs ${
          isSuccess ? 'text-muted-foreground' : 'text-destructive/80'
        }`}
      >
        {id}
      </span>
    </Badge>
  );
}
