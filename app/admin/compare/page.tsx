import { PageContainer } from '@/components/page/page-container';
import { CompareMap } from '../components/compare-map';
import {
  ResizableHandle,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/page/page-header';
import { CompareMapSwap } from '../components/compare-map-swap';
import { Toggle } from '@/components/ui/toggle';
import { LinkIcon } from 'lucide-react';

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ map1?: string; map2?: string }>;
}) {
  const { map1, map2 } = await searchParams;

  // const [view, setView] = useState<Partial<State>>({
  //   center: [497598, 6785131],
  //   zoom: 17,
  // });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Compare maps</PageHeaderTitle>
          <PageHeaderDescription>
            Compare two map versions side by side.
          </PageHeaderDescription>
        </PageHeaderContent>

        <PageHeaderActions>
          {/* <Toggle variant="outline">
            <LinkIcon />
            Link views
          </Toggle> */}

          <CompareMapSwap />
        </PageHeaderActions>
      </PageHeader>

      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 grow -mb-4"
      >
        <CompareMap id={map1} paramKey="map1" />
        <ResizableHandle className="my-4" withHandle />
        <CompareMap id={map2} paramKey="map2" />
      </ResizablePanelGroup>
    </PageContainer>
  );
}
