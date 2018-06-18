import { Component, OnInit, NgZone } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionService } from '../../services/extension.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from '../../services/local-storage.service';
import { AccountDataStorage } from '../../model/AccountDataStorage';
import { SmartAccountStorage } from '../../model/SmartAccountStorage';
import { Observable } from 'rxjs/Observable';
import { AddressUtil } from '../../util/addressUtil';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { ParameterUI } from '../../model/ParameterUI';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  contractAddress: any;
  name: any;
  executing: boolean;
  adding: boolean;
  importing: boolean;
  accountData: AccountDataStorage;
  
  constructor(private smartAccountService: SmartAccountService,
    private extensionService: ExtensionService,
    private localStorageService: LocalStorageService,
    private router: Router, 
    private zone : NgZone,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.executing = false;
    this.adding = false;
    this.importing = false;
    this.load();
  }

  clearAdding() {
    this.executing = false;
    this.adding = false;
    this.importing = false;
    this.contractAddress = null;
    this.name = null;
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
        smartAccountStorage["version"] = ret;
        if (ret) {
          self.smartAccountService.getETHBalance(smartAccountStorage.address).subscribe(ret => {
            smartAccountStorage["balance"] = ret;
            observer.next(smartAccountStorage);
          });
        } else {
          smartAccountStorage["balance"] = 0;
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
    if (this.name && this.name.status) {
      let self = this;
      this.executing = true;
      if (this.importing) {
        if (this.contractAddress && this.contractAddress.status) {
          this.smartAccountService.getSmartAccountVersion(this.contractAddress.value).subscribe(ret => {
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
            self.contractAddress = { value: contractAddress, status: true };
            self.redirect();
          } else {
            this.executing = false;
          }
        });
      }
    }
  }

  remove(event: Event, name: string, address: string) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { text: "Do you really want to remove " + name + "?", cancelLabel: "Cancel", confirmationLabel: "Confirm" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let accountData = this.localStorageService.getAccountData();
        accountData.removeSmartAccount(address);
        this.localStorageService.setAccountData(accountData);
        this.load();
      }
    });
  }

  goToSmartAccount(address: string) {
    this.zone.run(() => this.router.navigate(['account', address]));
  }

  redirect() {
    let accountData = this.localStorageService.getAccountData();
    accountData.addSmartAccount(this.name.value, this.contractAddress.value);
    this.localStorageService.setAccountData(accountData);
    let address = this.contractAddress.value;
    this.clearAdding();
    this.goToSmartAccount(address);
  }

  getNameIndex(): number {
    return 0;
  }

  getNameParameter(): ParameterUI {
    return new ParameterUI("Set a name", 6, 0, false, true, false);
  }

  setName(name: any) {
    this.name = name;
  }

  getContractAddressIndex(): number {
    return 1;
  }

  getContractAddressParameter(): ParameterUI {
    return new ParameterUI("Contract Address", 3, 0, false, true, false);
  }

  setContractAddress(contractAddress: any) {
    this.contractAddress = contractAddress;
  }
}
