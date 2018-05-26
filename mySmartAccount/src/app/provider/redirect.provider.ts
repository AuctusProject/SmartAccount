import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class RedirectProvider implements CanActivate {

  constructor(private localStorageService : LocalStorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var smartAccountAddress = this.localStorageService.getLocalStorage("smartAccountAddress");
    if (smartAccountAddress) {
      this.router.navigate(['/account', smartAccountAddress]);
    } 
    return true;
  }
}