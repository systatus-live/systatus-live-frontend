import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private language: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private httpService: HttpClient
  ) { }

  public getIPInfo() {
    return this.httpService.get("https://ipapi.co/json/");
  }

  public getLanguageList() {
    return [
      { code: "EN", language: "English", flag: "🇺🇸" },
      { code: "BR", language: "Português", flag: "🇧🇷" },
    ]
  }

  public async setLanguage(value: string = "") {
    if (value != "") {
      this.language.next(value);
    } else {
      const languageList = this.getLanguageList();

      // Try get language from cache
      const cacheLanguage = localStorage.getItem("language");
      let language: any = null;
      if (cacheLanguage) {
        language = languageList.find(l => l.code == cacheLanguage);
      }

      // Try get language from API
      if (!language) {
        await new Promise((resolve) => {
          this.getIPInfo().subscribe({
            next: (response: any) => {
              language = languageList.find(l => l.code == response.country_code);
              resolve(1);
            }
          })
        })
      }

      // If not find from cache or API, set a default language
      if (!language) {
        language = this.getLanguageList()[0];
      }

      this.language.next(language.code);
    }
  }

  public getLanguage(): Observable<string> {
    return this.language.asObservable();
  }
}