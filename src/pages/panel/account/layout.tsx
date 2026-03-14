import { useGlobalProvider } from "@/providers/GlobalProvider";
import { CreditCardIcon, UserIcon } from "lucide-react";
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
      icon: CreditCardIcon,
      label: "Assinatura",
      route: "/panel/account/subscription",
      active: router.pathname.startsWith("/panel/account/subscription")
    }
  ]

  const activeLabel = navList.find((item) => item.active)?.label ?? "Conta";

  return (
    <>
      <Head>
        <title>{`${activeLabel} • Systatus.Live`}</title>
      </Head>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-base font-semibold">{activeLabel}</h1>
        </div>

        <nav className="flex gap-1 border-b mb-6">
          {navList.map((item) => (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                item.active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </>
  )
}