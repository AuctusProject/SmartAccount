import { Component, OnInit, NgZone } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from '../../services/local-storage.service';
import { AccountDataStorage } from '../../model/AccountDataStorage';
import { SmartAccountStorage } from '../../model/SmartAccountStorage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  contractAddress: string;
  name: string;
  executing: boolean;
  adding: boolean;
  importing: boolean;
  accountData: AccountDataStorage;
  
  constructor(private smartAccountService: SmartAccountService, 
    private localStorageService: LocalStorageService,
    private router: Router, 
    private zone : NgZone) {
  }

  ngOnInit() {
    this.executing = false;
    this.adding = false;
    this.importing = false;
    this.contractAddress = "";
    this.load();
  }

  clearAdding() {
    this.executing = false;
    this.adding = false;
    this.importing = false;
    this.contractAddress = "";
    this.name = "";
  }

  load() {
    this.accountData = this.localStorageService.getAccountData();
    let array = [];
    for(let i = 0; i < this.accountData.smartAccounts.length; ++i) {
      array.push(this.setSmartAccountData(this.accountData.smartAccounts[i]));
    }
    let self = this;
    Observable.combineLatest(array)
    .subscribe(function handleValues(values) {
      self.localStorageService.setAccountData(self.accountData);
    });
  }

  setSmartAccountData(smartAccountStorage: SmartAccountStorage): Observable<SmartAccountStorage> {
    let self = this;
    return new Observable(observer => {
      self.smartAccountService.getSmartAccountVersion(smartAccountStorage.address).subscribe(ret => {
        smartAccountStorage.version = ret;
        if (smartAccountStorage.version) {
          self.smartAccountService.getETHBalance(smartAccountStorage.address).subscribe(ret => {
            smartAccountStorage.balance = ret;
            observer.next(smartAccountStorage);
          });
        } else {
          smartAccountStorage.balance = 0;
          observer.next(smartAccountStorage);
        }
      });
    });
  }

  removeSmartAccount(address: string) {
    this.accountData.removeSmartAccount(address);
    this.load();
  }

  create() {
    this.adding = true;
    this.importing = false;
    this.executing = false;
  }

  import() {
    this.adding = true;
    this.importing = true;
    this.executing = false;
  }

  getAction() {
    return this.importing ? "IMPORT" : "CREATE";
  }

  save() {
    if (this.name) {
      let self = this;
      this.executing = true;
      if (this.importing) {
        if (this.contractAddress) {
          this.smartAccountService.getSmartAccountVersion(this.contractAddress).subscribe(ret => {
            if (ret) {
              self.redirect();
            } else {
              this.executing = false;
            }
          });
        } else {
          this.executing = false;
        }
      } else {
        this.smartAccountService.createAccountSC().subscribe(contractAddress => {
          if (contractAddress) {
            self.contractAddress = contractAddress;
            self.redirect();
          } else {
            this.executing = false;
          }
        });
      }
    }
  }

  redirect() {
    let accountData = this.localStorageService.getAccountData();
    accountData.addSmartAccount(this.name, this.contractAddress);
    this.localStorageService.setAccountData(accountData);
    let sa = this.contractAddress;
    this.clearAdding();
    this.zone.run(() => this.router.navigate(['/account', sa]));
  }
}
