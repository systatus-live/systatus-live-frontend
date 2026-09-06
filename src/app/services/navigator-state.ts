import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NavigatorState {
  private readonly _ids = signal<string[]>([]);
  private readonly _routeBase = signal<string>("");

  public readonly ids = this._ids.asReadonly();
  public readonly routeBase = this._routeBase.asReadonly();

  public set(ids: string[], routeBase: string) {
    this._ids.set(ids);
    this._routeBase.set(routeBase);
  }

  public append(ids: string[]) {
    this._ids.update(prev => {
      const existing = new Set(prev);
      return [...prev, ...ids.filter(id => !existing.has(id))];
    });
  }
}
