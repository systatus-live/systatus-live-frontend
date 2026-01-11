import { RadarIcon, SirenIcon, Waypoints, HelpCircleIcon, UserIcon, ShieldIcon, CircleDotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import PanelLayout from "../layout";
import Link from "next/link";
import Head from "next/head";

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [navList, setNavList] = useState<any[]>([]);

  useEffect(() => {
    updateNavList();
  }, []);

  async function updateNavList() {
    const list = [
      {
        icon: UserIcon,
        label: "Detalhes",
        route: "/panel/account/details",
        active: false
      },
      {
        icon: ShieldIcon,
        label: "Segurança",
        route: "/panel/account/security",
        active: false
      }
    ]

    const navItem = list.find(item => item.route == window.location.pathname);
    if (navItem) {
      navItem.active = true;
    } else {
      list[0].active = true;
    }

    setNavList(list);
  }

  function updateActiveNavItem(index: number) {
    const list = [...navList];
    list.forEach(item => item.active = false);
    if (list[index]) {
      list[index].active = true;
    }
    setNavList(list);
  }

  return (
    <>
      <Head>
        <title>{`Conta • ${navList.find(item => item.active)?.label} • Systatus.Live}`}</title>
      </Head>

      <PanelLayout>
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Conta</h1>
        </div>
        <div className=" px-6">
          <div className="flex items-center bg-slate-800 rounded-lg">
            {navList.map((item, index) => (
              <Link key={index} href={item.route} className="flex justify-center w-[12rem]" onClick={() => updateActiveNavItem(index)}>
                <div className={`px-4 h-10 w-full flex items-center rounded-lg transition-colors text-white ${item.active ? "bg-slate-700" : "hover:bg-slate-700"}`}>
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
        <div className="px-6">
          <div className="py-4">
            {children}
          </div>
        </div>
      </PanelLayout>
    </>
  )
}