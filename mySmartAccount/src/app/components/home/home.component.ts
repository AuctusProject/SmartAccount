import { Component, OnInit, NgZone } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionService } from '../../services/extension.service';
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

  creating: boolean;
  importing: boolean;
  accountData: AccountDataStorage;
  
  constructor(private smartAccountService: SmartAccountService,
    private extensionService: ExtensionService,
    private localStorageService: LocalStorageService,
    private router: Router, 
    private zone : NgZone) {
  }

  ngOnInit() {
    //this.load();
    this.loadExtension();
  }

  loadExtension() {
    this.extensionService.getExtension("0x018ad16649D90F4A3A8195b57677491C687b5309").subscribe(ret => {
      
    });
  }

  load() {
    this.accountData = this.localStorageService.getAccountData();
    let array = [];
    for(let i = 0; i < this.accountData.smartAccounts.length; ++i) {
      array.push(this.setSmartAccountData(this.accountData.smartAccounts[i]));
    }
    Observable.combineLatest(array)
    .subscribe(function handleValues(values) {
      this.localStorageService.setAccountData(this.accountData);
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

  onCreateAccount() {
    this.creating = true;
    this.smartAccountService.getExtensions('0x51D6818d19b6933F73724c55fcAa2cFe1bA2b5a0').subscribe(ret =>
    {
      let x = ret;

    });
    /*
    this.smartAccountService.createAccountSC().subscribe(contractAddress => {
      this.creating = false;
      if (contractAddress) {
        this.zone.run(() => this.router.navigate(['/account', contractAddress]));
      }
    })
    */
  }
}
