import Loading from "@/components/Loading";
import Logo from "@/components/Logo";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import { CircleDotIcon, HelpCircleIcon, LogOut, RadarIcon, SirenIcon, Waypoints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
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
      await router.push("/auth/signin");
      setUser(null);
      setToken(null);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateNavList() {
    const list = [
      {
        icon: RadarIcon,
        label: "Monitores",
        route: "/panel/monitors",
        active: false
      },
      {
        icon: SirenIcon,
        label: "Incidentes",
        route: "/panel/incidents",
        active: false
      },
      {
        icon: Waypoints,
        label: "Integrações",
        route: "/panel/integrations",
        active: false
      },
      {
        icon: HelpCircleIcon,
        label: "Ajuda",
        route: "/panel/help",
        active: false
      }
    ]

    const navItem = list.find(item => item.route == window.location.pathname);
    if (navItem) {
      navItem.active = true;
    }

    setNavList(list);
  }

  function updateActiveNavItem(index: number | null) {
    const list = [...navList];
    list.forEach(item => item.active = false);
    if (index != null && list[index]) {
      list[index].active = true;
    }
    setNavList(list);
  }

  return (
    <>
      {isSubmitting && <Loading />}

      <div className="flex flex-rows h-screen">
        <div className="flex justify-between flex-col shadow-lg w-auto md:w-[300px] bg-slate-800">
          <div>
            <div className="py-4 px-4 border-b-1 border-b-gray-500 mb-6">
              <Logo inverted={true} />
            </div>
            <div className="flex flex-col items-center sm:items-start w-full">
              {navList.map((item, index) => (
                <Link key={index} href={item.route} className="flex justify-center w-full px-2 mb-1" onClick={() => updateActiveNavItem(index)}>
                  <div className={`px-4 h-10 w-full flex items-center rounded-lg transition-colors text-white ${item.active ? "bg-slate-700" : "hover:bg-slate-700"}`}>
                    <item.icon height={20} />
                    <div className="flex items-center justify-between w-full hidden sm:flex ml-3">
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
              {user && (
                <Link href="/panel/account/" className="block truncate max-w-auto text-gray-300 font-medium" onClick={() => updateActiveNavItem(null)}>
                  <div className="flex items-center space-x-3">
                     <div style={{ width: 37, height: 37, position: "relative", borderRadius: "50%", overflow: "hidden" }}>
                      <Image
                        src={user.avatar ?? "/images/avatar.jpg"}
                        alt="Avatar"
                        fill
                        sizes={`${37}px`}
                        style={{ objectFit: "cover" }}
                        priority
                      />
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
        <div className="w-full h-screen overflow-y-auto p-4 md:p-12">
          {children}
        </div>
      </div>
    </>
  )
}