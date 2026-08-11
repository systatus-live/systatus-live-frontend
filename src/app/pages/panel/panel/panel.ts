import { Component, OnInit, OnDestroy, computed, inject, signal, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router, RouterLink, RouterOutlet, NavigationEnd } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideRadar, lucideSiren, lucideWaypoints, lucideGlobe, lucideBadgeCheck, lucideCreditCard, lucideCircleHelp, lucideChevronsUpDown, lucideLogOut, } from "@ng-icons/lucide";
import { filter, map, startWith, firstValueFrom } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthService } from "../../../services/auth.service";
import { AppStateService } from "../../../state/app-state.service";
import { HlmSidebarService } from "../../../components/sidebar/src/lib/hlm-sidebar.service";
import { Alert } from "../../../lib/alert";
import { PermissionEnum } from "../../../types/permission.enum";
import { ThemeToggle } from "../../../components/theme-toggle/theme-toggle";
import { LogoComponent } from "../../../components/logo/logo.component";
import { HlmSidebar } from "../../../components/sidebar/src/lib/hlm-sidebar";
import { HlmSidebarContent } from "../../../components/sidebar/src/lib/hlm-sidebar-content";
import { HlmSidebarFooter } from "../../../components/sidebar/src/lib/hlm-sidebar-footer";
import { HlmSidebarGroup } from "../../../components/sidebar/src/lib/hlm-sidebar-group";
import { HlmSidebarGroupLabel } from "../../../components/sidebar/src/lib/hlm-sidebar-group-label";
import { HlmSidebarHeader } from "../../../components/sidebar/src/lib/hlm-sidebar-header";
import { HlmSidebarInset } from "../../../components/sidebar/src/lib/hlm-sidebar-inset";
import { HlmSidebarMenu } from "../../../components/sidebar/src/lib/hlm-sidebar-menu";
import { HlmSidebarMenuButton } from "../../../components/sidebar/src/lib/hlm-sidebar-menu-button";
import { HlmSidebarMenuItem } from "../../../components/sidebar/src/lib/hlm-sidebar-menu-item";
import { HlmSidebarRail } from "../../../components/sidebar/src/lib/hlm-sidebar-rail";
import { HlmSidebarTrigger } from "../../../components/sidebar/src/lib/hlm-sidebar-trigger";
import { HlmSidebarWrapper } from "../../../components/sidebar/src/lib/hlm-sidebar-wrapper";
import { HlmAvatar } from "../../../components/avatar/src/lib/hlm-avatar";
import { HlmAvatarFallback } from "../../../components/avatar/src/lib/hlm-avatar-fallback";
import { HlmAvatarImage } from "../../../components/avatar/src/lib/hlm-avatar-image";
import { HlmDropdownMenu } from "../../../components/dropdown-menu/src/lib/hlm-dropdown-menu";
import { HlmDropdownMenuGroup } from "../../../components/dropdown-menu/src/lib/hlm-dropdown-menu-group";
import { HlmDropdownMenuItem } from "../../../components/dropdown-menu/src/lib/hlm-dropdown-menu-item";
import { HlmDropdownMenuLabel } from "../../../components/dropdown-menu/src/lib/hlm-dropdown-menu-label";
import { HlmDropdownMenuSeparator } from "../../../components/dropdown-menu/src/lib/hlm-dropdown-menu-separator";
import { HlmDropdownMenuTrigger } from "../../../components/dropdown-menu/src/lib/hlm-dropdown-menu-trigger";
import { HlmBreadcrumb } from "../../../components/breadcrumb/src/lib/hlm-breadcrumb";
import { HlmBreadcrumbItem } from "../../../components/breadcrumb/src/lib/hlm-breadcrumb-item";
import { HlmBreadcrumbLink } from "../../../components/breadcrumb/src/lib/hlm-breadcrumb-link";
import { HlmBreadcrumbList } from "../../../components/breadcrumb/src/lib/hlm-breadcrumb-list";
import { NgxPermissionsService } from "ngx-permissions";

@Component({
  selector: "app-panel",
  imports: [
    RouterOutlet,
    RouterLink,
    NgIcon,
    ThemeToggle,
    LogoComponent,
    HlmSidebar,
    HlmSidebarContent,
    HlmSidebarFooter,
    HlmSidebarGroup,
    HlmSidebarGroupLabel,
    HlmSidebarHeader,
    HlmSidebarInset,
    HlmSidebarMenu,
    HlmSidebarMenuButton,
    HlmSidebarMenuItem,
    HlmSidebarRail,
    HlmSidebarTrigger,
    HlmSidebarWrapper,
    HlmAvatar,
    HlmAvatarFallback,
    HlmAvatarImage,
    HlmDropdownMenu,
    HlmDropdownMenuGroup,
    HlmDropdownMenuItem,
    HlmDropdownMenuLabel,
    HlmDropdownMenuSeparator,
    HlmDropdownMenuTrigger,
    HlmBreadcrumb,
    HlmBreadcrumbItem,
    HlmBreadcrumbLink,
    HlmBreadcrumbList,
  ],
  providers: [
    provideIcons({
      lucideRadar,
      lucideSiren,
      lucideWaypoints,
      lucideGlobe,
      lucideBadgeCheck,
      lucideCreditCard,
      lucideCircleHelp,
      lucideChevronsUpDown,
      lucideLogOut,
    }),
  ],
  templateUrl: "./panel.html",
  styleUrl: "./panel.scss",
})
export class Panel implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  public readonly appState = inject(AppStateService);
  public readonly router = inject(Router);
  public readonly sidebarService = inject(HlmSidebarService);
  private readonly ngxPermissionsService = inject(NgxPermissionsService);

  public readonly isDark = signal(false);

  public readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).url),
      startWith(this.router.url),
    ), {
    initialValue: this.router.url
  },
  );

  public readonly navList = computed(() => [
    {
      title: "Monitoramento",
      items: [
        { icon: "lucideRadar", title: "Monitores", url: "/panel/monitoring/monitors" },
        { icon: "lucideSiren", title: "Incidentes", url: "/panel/monitoring/incidents" },
        { icon: "lucideWaypoints", title: "Integrações", url: "/panel/monitoring/integrations" },
        ...(this.appState.permissionList().includes(PermissionEnum.STATUS_PAGE) ? [{ icon: "lucideGlobe", title: "Página de Status", url: "/panel/status-page" }] : []),
      ],
    },
    {
      title: "Conta",
      items: [
        { icon: "lucideBadgeCheck", title: "Perfil", url: "/panel/account/profile" },
        { icon: "lucideCreditCard", title: "Assinatura", url: "/panel/account/subscription" },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: "lucideCircleHelp", title: "Ajuda", url: "/panel/support/help" },
      ],
    },
  ]);

  public readonly activeItem = computed(() => {
    const url = this.currentUrl();
    for (const group of this.navList()) {
      const item = group.items.find((i) => url.startsWith(i.url));
      if (item) { return item; }
    }
    return null;
  });

  async ngOnInit() {
    this.initTheme();
    await this.loadUser();
  }

  private initTheme() {
    if (!isPlatformBrowser(this.platformId)) { return; }

    const saved = localStorage.getItem("panel-theme");
    const dark = !saved || saved === "dark";
    this.isDark.set(dark);
    document.documentElement.classList.toggle("dark", dark);

    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      this.appState.token.set(savedToken);
    }
  }

  private async loadUser() {
    try {
      const response: any = await firstValueFrom(this.authService.me());
      this.appState.user.set(response.data);
      this.appState.subscription.set(response.data.subscription);
      this.appState.permissionList.set(response.data.permissionList);
      this.ngxPermissionsService.loadPermissions(response.data.permissionList);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public handleThemeToggle(dark: boolean) {
    this.isDark.set(dark);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("panel-theme", dark ? "dark" : "light");
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.remove("dark");
    }
  }

  signOut() {
    this.authService.signOut();
  }
}
