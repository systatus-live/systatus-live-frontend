import Loading from "@/components/Loading";
import Logo from "@/components/Logo";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import { CircleDotIcon, CreditCardIcon, HelpCircleIcon, LogOut, LucideCircleDollarSign, RadarIcon, ShieldIcon, SirenIcon, UserIcon, Waypoints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser, setToken } = useGlobalProvider();
  const router = useRouter();

  const navList = [
    {
      group: "Monitoramento",
      items: [
        {
          icon: RadarIcon,
          label: "Monitores",
          route: "/panel/monitors",
          active: router.pathname.startsWith("/panel/monitors")
        },
        {
          icon: SirenIcon,
          label: "Incidentes",
          route: "/panel/incidents",
          active: router.pathname.startsWith("/panel/incidents")
        },
        {
          icon: Waypoints,
          label: "Integrações",
          route: "/panel/integrations",
          active: router.pathname.startsWith("/panel/integrations")
        },
      ]
    },
    {
      group: "Conta",
      items: [
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
    },
    {
      group: "Suporte",
      items: [
        {
          icon: HelpCircleIcon,
          label: "Ajuda",
          route: "/panel/help",
          active: router.pathname.startsWith("/panel/help")
        }
      ]
    }
  ]

  useEffect(() => {
    AuthService.meLocal().then((response: any) => {
      setUser(response.user);
      setToken(response.token);
    })

    return () => { }
  }, [])

  async function signOut() {
    setIsSubmitting(true);

    try {
      await AuthService.signOutLocal();
      await router.push("/auth/signin");
      setUser(null);
      setToken(null);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSubmitting && <Loading />}

      <div className="flex flex-rows h-screen">
        <div className="flex justify-between flex-col border-r-1 border-gray-200 w-auto md:w-[22rem] bg-slate-600">
          <div>
            <div className="py-4 px-4 border-b-1 border-b-gray-400 mb-6">
              <Logo inverted={true} />
            </div>
            <div className="flex flex-col items-center sm:items-start w-full">
              {navList.map((group, i) => (
                <div key={i} className="w-full">
                  <span className="hidden sm:flex uppercase tracking-wider my-3 px-4 text-gray-300">{group.group}</span>
                  {group.items.map((item: any, j: any) => (
                    <Link key={j} href={item.route} className="flex justify-center w-full mb-1 px-2">
                      <div className={`h-10 w-full flex items-center rounded-lg transition-colors text-gray-100 px-4 ${item.active ? "text-white bg-slate-800" : "hover:text-white hover:bg-slate-800"}`}>
                        <item.icon height={20} />
                        <div className="flex items-center justify-between w-full hidden sm:flex ml-3">
                          <span>{item.label}</span>
                          {item.active && <CircleDotIcon size={10} />}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full px-4 py-6 border-t-1 border-t-gray-500 flex items-center justify-between w-auto md:w-[22rem]">
            <div className="truncate mr-3 hidden md:block">
              {user && (
                <Link href="/panel/account/" className="block truncate max-w-auto text-gray-100 font-medium">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div style={{ width: 32, height: 32, position: "relative", borderRadius: "50%", overflow: "hidden" }}>
                        <Image src={user.avatar ?? "/images/avatar.jpg"} alt="Avatar" fill sizes={`${37}px`} style={{ objectFit: "cover" }} priority />
                      </div>
                    </div>
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                      <span>{user.name}</span><br />
                      <small>{user.email}</small>
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div>
              <LogOut height={22} className="text-gray-300 cursor-pointer" onClick={() => signOut()} />
            </div>
          </div>
        </div>
        <div className="w-full h-screen overflow-y-auto py-4 px-6 md:px-12 md:py-6">
          {children}
        </div>
      </div>
    </>
  )
}