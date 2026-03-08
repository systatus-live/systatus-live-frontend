import Logo from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import { BadgeCheck, ChevronsUpDown, CreditCard, CreditCardIcon, HelpCircleIcon, LogOut, LucideCircleDollarSign, RadarIcon, ShieldIcon, SirenIcon, Waypoints } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, setUser, setToken, setLoading } = useGlobalProvider();
  const router = useRouter();

  const navList = [
    {
      title: "Monitoramento",
      items: [
        {
          icon: RadarIcon,
          title: "Monitores",
          url: "/panel/monitors",
          isActive: router.pathname.startsWith("/panel/monitors")
        },
        {
          icon: SirenIcon,
          title: "Incidentes",
          url: "/panel/incidents",
          isActive: router.pathname.startsWith("/panel/incidents")
        },
        {
          icon: Waypoints,
          title: "Integrações",
          url: "/panel/integrations",
          isActive: router.pathname.startsWith("/panel/integrations")
        },
      ]
    },
    {
      title: "Conta",
      items: [
        {
          icon: BadgeCheck,
          title: "Detalhes",
          url: "/panel/account/details",
          isActive: router.pathname.startsWith("/panel/account/details")
        },
        {
          icon: CreditCardIcon,
          title: "Assinatura",
          url: "/panel/account/subscription",
          isActive: router.pathname.startsWith("/panel/account/subscription")
        }
      ]
    },
    {
      title: "Suporte",
      items: [
        {
          icon: HelpCircleIcon,
          title: "Ajuda",
          url: "/panel/help",
          isActive: router.pathname.startsWith("/panel/help")
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
    setLoading(true);

    try {
      await AuthService.signOutLocal();
      await router.push("/auth/signin");
      setUser(null);
      setToken(null);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  function getSelected() {
    const nav = navList.find(nav => nav.items.filter(item => item.isActive == true).length > 0);
    const item = nav?.items.find(item => item.isActive == true);
    return `${nav?.title} | ${item?.title}`;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        {/* Navigation */}
        <SidebarContent>
          {navList.map((group, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => (
                  <Link href={item.url} key={item.url}>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        {/* Footer */}
        <SidebarFooter>
          <SidebarMenu>
            {user == null ? <></> :
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user!.name}</span>
                        <span className="truncate text-xs">{user!.email}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="end" sideOffset={4} >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={user!.avatar} alt={user!.name} />
                          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{user!.name}</span>
                          <span className="truncate text-xs">{user!.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/panel/account/details">
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Conta
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/panel/account/subscription">
                        <DropdownMenuItem>
                          <CreditCard />
                          Assinatura
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            }
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {getSelected()}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}