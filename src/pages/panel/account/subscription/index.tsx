import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import AccountLayout from '../layout';

const Subscription: NextPageWithLayout = ({ monitorResponse }: any) => {
  return (
    <div>
      Subscription
    </div>
  )
}

Subscription.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

export default Subscription;