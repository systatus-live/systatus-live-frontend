import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import AccountLayout from '../layout';

const Details: NextPageWithLayout = ({ monitorResponse }: any) => {
  return (
    <div>
      Details
    </div>
  )
}

Details.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

export default Details;