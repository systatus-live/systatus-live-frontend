import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit, OnDestroy {
  ngOnInit() {
    document.documentElement.classList.add("dark");
  }

  ngOnDestroy() {
    document.documentElement.classList.remove("dark");
  }
}
