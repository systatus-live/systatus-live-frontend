import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DefaultAPIResponseDTO } from '../../dtos/DefaultAPIResponseDTO';
import { SigninTypeEnum } from '../../enums/SigninTypeEnum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public signUp(data: any) {
    return this.http.post<DefaultAPIResponseDTO>(`${environment.api}/auth/signup`, data);
  }

  public sendCode(email: string) {
    return this.http.post<DefaultAPIResponseDTO>(`${environment.api}/auth/codes`, {
      email: email
    });
  }

  public verifyCode(code: string) {
    return this.http.patch<DefaultAPIResponseDTO>(`${environment.api}/auth/codes`, {
      code: code
    });
  }

  public signinWithPassword(email: string, password: string) {
    const data = {
      email: email,
      password: password,
      type: SigninTypeEnum.EMAIL_PASSWORD
    }
    return this.http.post<DefaultAPIResponseDTO>(`${environment.api}/auth/signin`, data);
  }

  public signinWithGoogle(credential: string) {
    const data = {
      credential: credential,
      type: SigninTypeEnum.GOOGLE
    }
    return this.http.post<DefaultAPIResponseDTO>(`${environment.api}/auth/signin`, data);
  }

  public signOut() {
    localStorage.clear();
    this.router.navigate(["/auth/signin"]);
  }
}
