import { NextPageWithLayout } from '@/pages/_app';
import type { ReactElement } from 'react';
import PanelLayout from '../layout';

const Monitors: NextPageWithLayout = () => {
  return <p>Monitors</p>
}

Monitors.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Monitors;