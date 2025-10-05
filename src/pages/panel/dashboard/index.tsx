import { NextPageWithLayout } from '@/pages/_app';
import type { ReactElement } from 'react';
import PanelLayout from '../layout';

const Dashboard: NextPageWithLayout = () => {
  return <p>Dashboard</p>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Dashboard;