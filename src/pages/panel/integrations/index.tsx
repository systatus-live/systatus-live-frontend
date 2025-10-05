import { NextPageWithLayout } from '@/pages/_app';
import type { ReactElement } from 'react';
import PanelLayout from '../layout';

const Integrations: NextPageWithLayout = () => {
  return <p>Integrations</p>
}

Integrations.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Integrations;