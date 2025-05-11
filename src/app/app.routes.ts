import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { TermsOfUseComponent } from './pages/agreement/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './pages/agreement/privacy-policy/privacy-policy.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PanelComponent } from './pages/panel/panel.component';
import { TermsOfUseEnUsComponent } from './pages/agreement/terms-of-use/terms-of-use-en-us/terms-of-use-en-us.component';
import { TermsOfUsePtBrComponent } from './pages/agreement/terms-of-use/terms-of-use-pt-br/terms-of-use-pt-br.component';

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
        path: "terms-of-use",
        component: TermsOfUseComponent
      },
      {
        path: "privacy-policy",
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
