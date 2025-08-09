import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private language: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private translate: TranslateService
  ) {
    this.translate.addLangs(["pt-br", "en-us"]);
    this.translate.setDefaultLang("pt-br");
  }

  public getLanguageList() {
    return [
      { code: "pt-br", language: "Português", flag: "🇧🇷" },
      { code: "en-us", language: "English (beta)", flag: "🇺🇸" },
    ]
  }

  public setLanguage(value: string = "") {
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

      // Try get language from browser
      if (!language) {
        language = languageList.find(l => l.code == navigator.language.toLowerCase());
      }

      // If not find from cache or browser, set a default language
      if (!language) {
        language = this.getLanguageList()[0];
      }

      this.language.next(language.code);
    }


    this.translate.use(this.language.value);
  }

  public getLanguage(asObservable : boolean): Observable<string> | string {
    return asObservable ? this.language.asObservable() : this.language.getValue();
  }

  public getTranslate(key: string, fields = {}) {
    return this.translate.instant(key, fields);
  }
}