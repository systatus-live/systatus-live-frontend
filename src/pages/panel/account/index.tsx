import AccountPassword from '@/components/Panel/Account/AccountPassword';
import { NextPageWithLayout } from '@/pages/_app';
import Head from 'next/head';
import { TabPanel, TabView } from 'primereact/tabview';
import { type ReactElement } from 'react';
import AccountLayout from '../layout';
import AccountDetail from '@/components/Panel/Account/AccountDetail';
import { CreditCard, Receipt, ShieldIcon, UserIcon } from 'lucide-react';

const Account: NextPageWithLayout = () => {
  const navItemList = [
    {
      title: "Informações Pessoais",
      icon: UserIcon,
      children: AccountDetail
    },
    {
      title: "Segurança",
      icon: ShieldIcon,
      children: AccountPassword
    },
    // { // TODO
    //   title: "Assinatura",
    //   icon: CreditCard,
    //   children: null
    // },
    // { // TODO
    //   title: "Faturas",
    //   icon: Receipt,
    //   children: null
    // }
  ]
  return (
    <>
      <Head>
        <title>Conta • Systatus.Live</title>
      </Head>

      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <h1 className="text-xl font-bold">Conta</h1>
        <div></div>
      </div>

      <div className="px-6 mt-6">
        <TabView>
          {navItemList.map(item => (
            <TabPanel key={item.title} header={
              <div className="flex items-center space-x-2">
                <item.icon width={16} />
                <span>{item.title}</span>
              </div>
            }>
              <div className="p-4 bg-white rounded-b-lg rounded-r-lg border-1 border-gray-200">
                <item.children />
              </div>
            </TabPanel>
          ))}
        </TabView>
      </div>
    </>
  )
}

Account.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

export default Account;