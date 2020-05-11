import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  public get<T>(key: string): any {
    return JSON.parse(localStorage.getItem(key)) as T;
  }

  public getCatalog<T>(key: string) {
    const before = localStorage.getItem(key);
    return before ? (JSON.parse(before) as T[]) : [];
  }

  public set(key: string, value: any): void {
    if (!value && value == undefined) { return; }
    const array = JSON.stringify(value);
    localStorage.setItem(key, array);
  }

}
