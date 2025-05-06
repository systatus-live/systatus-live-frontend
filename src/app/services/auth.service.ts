import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DefaultAPIResponseDTO } from '../dtos/DefaultAPIResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  public signup(data: any) {
    return this.http.post<DefaultAPIResponseDTO>(`${environment.api}/auth/signup`, data);
  }

  public verifyCode(code: string) {
    return this.http.patch<DefaultAPIResponseDTO>(`${environment.api}/auth/code-verifications`, { code });
  }
}
