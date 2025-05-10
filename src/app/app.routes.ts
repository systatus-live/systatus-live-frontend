import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { TermsOfServiceComponent } from './pages/agreement/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/agreement/privacy-policy/privacy-policy.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PanelComponent } from './pages/panel/panel.component';

export const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent
  },
  {
    path: "auth",
    children: [
      {
        path: "signup",
        component: SignupComponent
      },
      {
        path: "signin",
        component: SigninComponent
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
        path: "policy-privacy",
        component: PrivacyPolicyComponent
      }
    ]
  },
  {
    path: "panel",
    component: PanelComponent
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];
