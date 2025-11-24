import Loading from "@/components/Loading";
import Logo from "@/components/Logo";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import { BarChart2Icon, CircleDotIcon, LogOut, MonitorIcon, Waypoints } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser, setToken } = useGlobalProvider();
  const [navList, setNavList] = useState<any[]>([]);
  const router = useRouter();


  useEffect(() => {
    AuthService.meLocal().then((response: any) => {
      setUser(response.user);
      setToken(response.token);
    })

    updateNavList();

    return () => { }
  }, [])

  async function signOut() {
    setIsSubmitting(true);

    try {
      await AuthService.signOutLocal();
      router.push("/auth/signin");
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateNavList() {
    const list = [
      {
        icon: BarChart2Icon,
        label: "Dashboard",
        route: "/panel/dashboard",
        active: false
      },
      {
        icon: MonitorIcon,
        label: "Monitores",
        route: "/panel/monitors",
        active: false
      },
      {
        icon: Waypoints,
        label: "Integrações",
        route: "/panel/integrations",
        active: false
      },
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
    list[index].active = true;
    setNavList(list);
  }

  return (
    <>
      {isSubmitting && <Loading />}

      <div className="flex flex-rows h-screen">
        <div className="flex justify-between flex-col shadow-lg w-auto sm:w-xs border-r border-gray-200 bg-slate-800">
          <div>
            <div className="p-4 border-b-1 border-b-gray-500 mb-6">
              <Logo inverted={true} />
            </div>
            <div className="flex flex-col items-center sm:items-start w-full">
              {navList.map((item, index) => (
                <Link key={index} href={item.route} className="flex justify-center w-full px-2 mb-1" onClick={() => updateActiveNavItem(index)}>
                  <div className={`px-4 h-10 w-full flex items-center text-slate-300 rounded-lg transition-colors text-white ${item.active ? "bg-slate-700" : "hover:bg-slate-700"}`}>
                    <item.icon height={20} />
                    <div className="flex items-center justify-between w-full hidden sm:flex text-sm ml-3">
                      <span>{item.label}</span>
                      {item.active && <CircleDotIcon size={10} />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full px-4 py-6 border-t-1 border-t-gray-500 flex items-center justify-between">
            <div className="truncate mr-3 hidden md:block">
              <p className="text-sm text-gray-300 overflow-hidden whitespace-nowrap text-ellipsis">{user.name}</p>
            </div>
            <div>
              <LogOut height={22} className="text-gray-300 cursor-pointer" onClick={() => signOut()} />
            </div>
          </div>
        </div>
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
          {children}
        </div>
      </div>
    </>
  )
}