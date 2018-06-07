import { Injectable } from '@angular/core';
import { AccountDataStorage } from '../model/AccountDataStorage';


@Injectable()
export class LocalStorageService {
  accountData: string = 'accountData';

  constructor() { }

  public setLocalStorage(key: string, value: any): void {
    if (window) window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  }

  public getLocalStorage(key: string): any {
    return window ? window.localStorage.getItem(key) : null;
  }

  public removeLocalStorage(key: string): void {
    if (window) window.localStorage.removeItem(key);
  }

  public getAccountData(): AccountDataStorage {
    let data = this.getLocalStorage(this.accountData);
    return data ? JSON.parse(data) : new AccountDataStorage();
  }

  public setAccountData(storage: AccountDataStorage): void {
    this.setLocalStorage(this.accountData, storage);
  }
}
