import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  public setLoading(loading: boolean): void {
    this.isLoading.next(loading);
  }

  public getLoading(): Observable<boolean> {
    return this.isLoading.asObservable();
  }
}
