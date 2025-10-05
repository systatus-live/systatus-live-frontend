import Logo from "@/components/logo";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import { BarChart2Icon, LogOut, MonitorIcon, Waypoints } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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

  const { user, setUser } = useGlobalProvider();

  useEffect(() => {
    AuthService.meCallback().then(response => {
      setUser(response);
    })
    return () => {}
  }, [])
  
  return (
    <div className="flex flex-rows min-h-screen">
      <div className="flex justify-between flex-col shadow-lg w-2xl lg:w-xs">
        <div>
          <div className="p-4">
            <Logo />
          </div>
          <div>
            {navList.map((item, index) => (
              <Link key={index} href={item.route}>
                <div className="ml-1 pl-3 h-10 flex items-center font-light hover:text-blue-700 hover:font-light border-l-4 border-l-white hover:border-l-blue-700 hover:bg-blue-50">
                  <item.icon className="mr-2" height={18} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="w-full px-4 py-6 border-t-1 border-t-gray-300 flex items-center justify-between">
          <div className="truncate mr-3">
            <p>{user.name}</p>
          </div>
          <div>
            <LogOut height={22} className="text-gray-500" />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 w-full p-6">
        {children}
      </div>
    </div>
  )
}