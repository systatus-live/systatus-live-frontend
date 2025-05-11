import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private language: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private httpService: HttpClient,
    private translate: TranslateService
  ) {
    this.translate.addLangs(["pt-br", "en"]);
    this.translate.setDefaultLang("en");
  }

  public getIPInfo() {
    return this.httpService.get("http://ip-api.com/json/");
  }

  public getLanguageList() {
    return [
      { code: "en", language: "English", flag: "🇺🇸" },
      { code: "pt-br", language: "Português", flag: "🇧🇷" },
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
            },
            error: (error) => {
              console.log(error);
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


    this.translate.use(this.language.value);
  }

  public getLanguage(): Observable<string> {
    return this.language.asObservable();
  }
}