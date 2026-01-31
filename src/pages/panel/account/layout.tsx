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
        <title>{`Conta • ${navList.find(item => item.active)?.label} • Systatus.Live}`}</title>
      </Head>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Conta</h1>
      </div>
      <div className="mb-6">
        <div className="flex items-center bg-slate-600 rounded-lg">
          {navList.map((item, index) => (
            <Link key={index} href={item.route} className="flex justify-center w-[12rem]" onClick={() => setLoading(true)}>
              <div className={`px-4 h-10 w-full flex items-center rounded-lg transition-colors text-gray-100 ${item.active ? "text-white bg-slate-800" : "hover:text-white hover:bg-slate-800"}`}>
                <item.icon height={16} />
                <div className="flex items-center justify-between w-full ml-3">
                  <span>{item.label}</span>
                  {item.active && <CircleDotIcon size={10} />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        {children}
      </div>
    </>
  )
}