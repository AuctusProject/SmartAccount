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
    let self = this;
    this.route.params.subscribe(params => {
      self.smartAccount = self.localStorageService.getAccountData().getSmartAccount(params["address"]);
      if (!self.smartAccount) {
        this.zone.run(() => this.router.navigate(['home']));
      } else {
        self.load();
      }
    });
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
      for(let i = 0; i < self.smartAccount.extensions.length; ++i) {
        let isRemoved = true;
        if (extension) {
          for(let j = 0; j < extension.length; ++j) {
            if (self.smartAccount.extensions[i].address == extension[j].address) {
              isRemoved = false;
              break;
            }
          }
        }
        if (isRemoved) {
          self.smartAccount.removeExtension(self.smartAccount.extensions[i].address);
        }
      }
      if (extension) {
        for(let i = 0; i < extension.length; ++i) {
          self.smartAccount.addExtension(extension[i].address);
          self.smartAccount.setExtensionIdentifiers(extension[i].address, extension[i].getIdentifiersList());
        }
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

  getBackDestination(){
    return ['home'];
  }

  getAddressLink() {
    let chainId = this.smartAccountService.getNetwork();
    let start;
    switch (chainId) {
      case "1":
        start = "";
        break;
      case "2":
        start = "ropsten.";
        break;
      case "3":
        start = "kovan.";
        break;
      case "4":
        start = "rinkeby.";
        break;
      default: 
        return "#";
    }
    return "https://" + start + "etherscan.io/address/" + this.smartAccount.address;
  }
}
