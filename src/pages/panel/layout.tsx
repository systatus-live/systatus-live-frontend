import Loading from "@/components/Loading";
import Logo from "@/components/Logo";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import { BarChart2Icon, LogOut, MonitorIcon, Waypoints } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navList = [
    {
      icon: BarChart2Icon,
      label: "Dashboard",
      route: "/panel/dashboard"
    },
    {
      icon: MonitorIcon,
      label: "Monitores",
      route: "/panel/monitors"
    },
    {
      icon: Waypoints,
      label: "Integrações",
      route: "/panel/integrations"
    },
  ];

  const { user, setUser, setToken } = useGlobalProvider();
  const router = useRouter();

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
      router.push("/auth/signin");
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
        <div className="flex justify-between flex-col shadow-lg w-auto sm:w-xs border-r border-gray-200 bg-slate-800">
          <div>
            <div className="p-4 border-b-1 border-b-gray-500 mb-6">
              <Logo inverted={true} iconOnly={true} />
            </div>
            <div className="flex flex-col items-center sm:items-start w-full">
              {navList.map((item, index) => (
                <Link key={index} href={item.route} className="flex justify-center w-full px-2 mb-1">
                  <div className="px-4 h-10 w-full flex items-center text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                    <item.icon className="mr-3" height={20} />
                    <span className="hidden sm:block text-sm">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full px-4 py-6 border-t-1 border-t-gray-500 flex items-center justify-between">
            <div className="truncate mr-3 hidden md:block">
              <p className="text-sm text-gray-300">{user.name}</p>
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