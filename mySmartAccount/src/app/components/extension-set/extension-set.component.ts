import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { Web3Service } from '../../services/web3.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionData } from '../../model/ExtensionData';
import { Router } from '@angular/router';
import { ExtensionStorage } from '../../model/ExtensionStorage';

@Component({
  selector: 'app-extension-set',
  templateUrl: './extension-set.component.html',
  styleUrls: ['./extension-set.component.css']
})
export class ExtensionSetComponent implements OnInit {

  smartAccountAddress: string;
  extensionAddress: string;
  active: boolean;
  executing: boolean;
  roles: string[];
  name: string;
  description: string;

  constructor(private route: ActivatedRoute, 
    private zone: NgZone, 
    private router: Router,
    private localStorageService: LocalStorageService,
    private web3Service: Web3Service,
    private smartAccountService: SmartAccountService) { }
    
  ngOnInit() {
    let self = this;
    this.route.params.subscribe(params => {
      self.smartAccountAddress = params["smartaccountaddress"];
      self.extensionAddress = params["extensionaddress"];
      if (!self.smartAccountAddress || !self.extensionAddress) {
        self.zone.run(() => self.router.navigate(['home']));
      } else {
        let allExtensions = self.localStorageService.getAccountData().getSmartAccount(self.smartAccountAddress).getAllExtensionList(self.smartAccountService.getNetwork());
        for (let i = 0; i < allExtensions.length; ++i) {
          if (allExtensions[i].address == self.extensionAddress) {
            self.roles = self.smartAccountService.getRolesNames(allExtensions[i].rolesIds);
            self.active = !!allExtensions[i].dateUnix;
            break;
          }
        }
        let ui = self.localStorageService.getAccountData().getExtensionUI(self.extensionAddress);
        if (ui) {
          self.name = ui.name;
          self.description = ui.description;
        }
        self.executing = false;
      }
    });
  }

  getBackDestination() {
    return ['account', this.smartAccountAddress];
  }

  back() {
    this.zone.run(() => this.router.navigate(this.getBackDestination()));
  }

  getActionName() {
    return this.active ? "INACTIVE" : "ACTIVE";
  }

  setAction() {
    let self = this;
    this.executing = true;
    if (!this.active) {
      this.smartAccountService.addExtension(this.smartAccountAddress, this.extensionAddress).subscribe(txHash => {
        self.web3Service.isMined(txHash).subscribe(ret => {
          self.back();
        });
      });
    } else {
      this.smartAccountService.removeExtension(this.smartAccountAddress, this.extensionAddress).subscribe(txHash => {
        self.web3Service.isMined(txHash).subscribe(ret => {
          self.back();
        });
      });
    }
  }
}
