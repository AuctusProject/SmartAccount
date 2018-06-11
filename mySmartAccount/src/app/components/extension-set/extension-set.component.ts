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
        let extensions = self.localStorageService.getAccountData().getSmartAccount(self.smartAccountAddress).extensions;
        for (let i = 0; i < extensions.length; ++i) {
          if (extensions[i].address == self.extensionAddress) {
            self.roles = self.smartAccountService.getRolesNames(extensions[i].rolesIds);
            self.active = true;
            break;
          }
        }
        let ui = self.localStorageService.getAccountData().extensionUIs;
        for (let i = 0; i < ui.length; ++i) {
          if (ui[i].address == self.extensionAddress) {
            self.name = ui[i].name;
            self.description = ui[i].description;
            break;
          }
        }
        if (!self.active) {
          self.smartAccountService.getRolesId(self.extensionAddress).subscribe(ret => {
            self.roles = self.smartAccountService.getRolesNames(ret);
          });
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
