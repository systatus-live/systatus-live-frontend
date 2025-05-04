import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { TermsOfServiceComponent } from './pages/agreement/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/agreement/privacy-policy/privacy-policy.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent
  },
  {
    path: "auth",
    children: [
      {
        path: "register",
        component: RegisterComponent
      },
      {
        path: "login",
        component: LoginComponent
      }
    ]
  },
  {
    path: "agreements",
    children: [
      {
        path: "terms-of-service",
        component: TermsOfServiceComponent
      },
      {
        path: "privacy-policy",
        component: PrivacyPolicyComponent
      }
    ]
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];
