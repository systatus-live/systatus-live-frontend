import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { TermsOfServiceComponent } from './pages/agreement/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/agreement/privacy-policy/privacy-policy.component';

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
  }
];
