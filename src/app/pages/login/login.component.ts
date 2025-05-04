import { Component, inject, NgZone, OnInit } from '@angular/core';
import { PrimengModule } from '../../modules/primeng/primeng.module';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-login',
  imports: [
    PrimengModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public googleClientId = environment.googleClientId;

  constructor() {
    (window as any).googleLoginCallback = (response: any) => {
      const token = response.credential;
      console.log(token);
    };
  }

  ngOnInit(): void {
   
  }
}