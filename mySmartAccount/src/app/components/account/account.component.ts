import { Component, OnInit, Input, NgZone } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SmartAccountStorage } from '../../model/SmartAccountStorage';
import { TokenStorage } from '../../model/TokenStorage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  smartAccount: SmartAccountStorage;

  constructor(private smartAccountService: SmartAccountService, 
    private localStorageService: LocalStorageService,
    private router: Router, 
    private route: ActivatedRoute,
    private zone : NgZone) { }

  ngOnInit() {
    this.smartAccount = this.route.snapshot.data["smartAccount"];
    if (!this.smartAccount) {
      this.back();
    } else {
      this.load();
    }
  }

  load() {
    let self = this;
    this.smartAccountService.getETHBalance(this.smartAccount.address).subscribe(ret => {
      self.smartAccount["balance"] = ret;
    });
    for(let i = 0; i < this.smartAccount.tokens.length; ++i) {
      self.setTokenBalance(this.smartAccount.address, this.smartAccount.tokens[i]);
    }
    this.smartAccountService.getExtensions(this.smartAccount.address).subscribe(extension => {
      for(let i = 0; i < extension.length; ++i) {
        self.smartAccount.setExtensionIdentifiers(extension[i].address, extension[i].getIdentifiersList());
      }
      let account = self.localStorageService.getAccountData();
      account.updateSmartAccount(self.smartAccount);
      self.localStorageService.setAccountData(account);
    });
  }

  setTokenBalance(smartAddress: string, token: TokenStorage) {
    this.smartAccountService.getTokenBalance(smartAddress, token.address, token.decimals).subscribe(ret => {
      token["balance"] = ret;
    });
  }

  back(){
    this.zone.run(() => this.router.navigate(['home']));
  }
}
