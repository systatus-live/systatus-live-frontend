import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth-guard";
import { panelGuard } from "./guards/panel-guard";
import { ngxPermissionsGuard } from 'ngx-permissions';
import { PermissionEnum } from "./types/permission.enum";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then(m => m.HomeComponent),
  },
  {
    path: "contact",
    title: "Contato • Systatus.Live",
    loadComponent: () => import("./pages/contact/contact").then(m => m.Contact),
  },
  {
    path: "agreements",
    loadComponent: () => import("./pages/agreements/agreements/agreements").then(m => m.Agreements),
    children: [
      {
        path: "terms-of-use",
        title: "Termos de Uso • Systatus.Live",
        loadComponent: () => import("./pages/agreements/terms-of-use/terms-of-use/terms-of-use").then(m => m.TermsOfUse),
      },
      {
        path: "privacy-policy",
        title: "Política de Privacidade • Systatus.Live",
        loadComponent: () => import("./pages/agreements/privacy-policy/privacy-policy/privacy-policy").then(m => m.PrivacyPolicy),
      },
    ],
  },
  {
    path: "status/:slug",
    loadComponent: () => import("./pages/status-public/status-public").then(m => m.StatusPublic),
  },
  {
    path: "auth",
    canActivate: [authGuard],
    loadComponent: () => import("./pages/auth/auth").then(m => m.Auth),
    children: [
      {
        path: "signup",
        title: "Cadastrar • Systatus.Live",
        loadComponent: () => import("./pages/auth/signup/signup").then(m => m.Signup),
      },
      {
        path: "signin",
        title: "Entrar • Systatus.Live",
        loadComponent: () => import("./pages/auth/signin/signin").then(m => m.Signin),
      },
      {
        path: "forgot-password",
        title: "Redefinir Senha • Systatus.Live",
        loadComponent: () => import("./pages/auth/forgot-password/forgot-password").then(m => m.ForgotPassword),
      },
      {
        path: "reset-password",
        title: "Redefinir Senha • Systatus.Live",
        loadComponent: () => import("./pages/auth/reset-password/reset-password").then(m => m.ResetPassword),
      },
      {
        path: "verify-account",
        title: "Verificar Conta • Systatus.Live",
        loadComponent: () => import("./pages/auth/verify-account/verify-account").then(m => m.VerifyAccount),
      },
    ],
  },
  {
    path: "panel",
    canActivate: [panelGuard],
    loadComponent: () => import("./pages/panel/panel/panel").then(m => m.Panel),
    children: [
      {
        path: "",
        redirectTo: "monitors",
        pathMatch: "full",
      },
      {
        path: "incidents",
        title: "Incidentes • Systatus.Live",
        loadComponent: () => import("./pages/panel/incidents/incidents-list/incidents-list").then(m => m.IncidentsList),
      },
      {
        path: "integrations",
        children: [
          {
            path: "",
            title: "Integrações • Systatus.Live",
            loadComponent: () => import("./pages/panel/integrations/integrations-list/integrations-list").then(m => m.IntegrationsList),
          },
          {
            path: "new",
            title: "Nova Integração • Systatus.Live",
            loadComponent: () => import("./pages/panel/integrations/integrations-create/integrations-create").then(m => m.IntegrationsCreate),
          },
          {
            path: "edit/:id",
            title: "Integração • Systatus.Live",
            loadComponent: () => import("./pages/panel/integrations/integrations-edit/integrations-edit").then(m => m.IntegrationsEdit),
          },
        ],
      },
      {
        path: "status-page",
        title: "Página de Status • Systatus.Live",
        loadComponent: () => import("./pages/panel/status-page/status-page").then(m => m.StatusPage),
        canActivate: [ngxPermissionsGuard],
        data: {
          permissions: {
            only: [PermissionEnum.STATUS_PAGE],
            redirectTo: "/panel"
          }
        }
      },
      {
        path: "account",
        loadComponent: () => import("./pages/panel/account/account/account").then(m => m.Account),
        children: [
          {
            path: "",
            redirectTo: "details",
            pathMatch: "full",
          },
          {
            path: "details",
            title: "Conta • Systatus.Live",
            loadComponent: () => import("./pages/panel/account/details/details").then(m => m.Details),
          },
          {
            path: "subscription",
            title: "Assinatura • Systatus.Live",
            loadComponent: () => import("./pages/panel/account/subscription/subscription").then(m => m.Subscription),
          },
        ],
      },
      {
        path: "help",
        title: "Ajuda • Systatus.Live",
        loadComponent: () => import("./pages/panel/help/help").then(m => m.Help),
      },
      {
        path: "monitors",
        children: [
          {
            path: "",
            title: "Monitores • Systatus.Live",
            loadComponent: () => import("./pages/panel/monitors/monitors-list/monitors-list").then(m => m.MonitorsList),
          },
          {
            path: "create",
            title: "Novo Monitor • Systatus.Live",
            loadComponent: () => import("./pages/panel/monitors/monitors-create/monitors-create").then(m => m.MonitorsCreate),
          },
          {
            path: "edit/:id",
            title: "Monitor • Systatus.Live",
            loadComponent: () => import("./pages/panel/monitors/monitors-edit/monitors-edit").then(m => m.MonitorsEdit),
          },
        ],
      },
    ],
  },
];
