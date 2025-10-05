import { NextPageWithLayout } from '@/pages/_app';
import type { ReactElement } from 'react';
import { useRouter } from "next/router";
import { useEffect } from "react";
import PanelLayout from './layout';

const Panel: NextPageWithLayout = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/panel/dashboard");
  }, []);
  
  return <></>
}

Panel.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Panel;