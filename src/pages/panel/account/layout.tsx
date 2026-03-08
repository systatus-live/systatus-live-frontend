import { useGlobalProvider } from "@/providers/GlobalProvider";
import { CircleDotIcon, CreditCardIcon, LucideCircleDollarSign, ShieldIcon, UserIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { setLoading } = useGlobalProvider();

  useEffect(() => {
    setLoading(false);
  }, []);

  const navList = [
    {
      icon: UserIcon,
      label: "Detalhes",
      route: "/panel/account/details",
      active: router.pathname.startsWith("/panel/account/details")
    },
    {
      icon: ShieldIcon,
      label: "Segurança",
      route: "/panel/account/security",
      active: router.pathname.startsWith("/panel/account/security")
    },
    {
      icon: CreditCardIcon,
      label: "Assinatura",
      route: "/panel/account/subscription",
      active: router.pathname.startsWith("/panel/account/subscription")
    },
    {
      icon: LucideCircleDollarSign,
      label: "Faturamento",
      route: "/panel/account/billing",
      active: router.pathname.startsWith("/panel/account/billing")
    }
  ]

  return (
    <>
      <Head>
        <title>{`${navList.find(item => item.active)?.label} • Systatus.Live`}</title>
      </Head>

      <div>
        {children}
      </div>
    </>
  )
}