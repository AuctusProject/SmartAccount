import { Component, OnInit, Input, NgZone } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { SmartAccountService } from '../../../services/smart-account.service';
import { ExtensionService } from '../../../services/extension.service';
import { ExtensionStorage } from '../../../model/ExtensionStorage';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressUtil } from '../../../util/addressUtil';
import { ParameterUI } from '../../../model/ParameterUI';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.css']
})
export class ExtensionListComponent implements OnInit {

  @Input() extensionList: ExtensionStorage[];
  @Input() allExtensions: ExtensionStorage[];
  @Input() smartAccountAddress: string;
  showList: boolean;
  showIdentifiers: boolean;
  showNew: boolean;
  selectedExtension: ExtensionStorage;
  selectedActive: boolean;
  executing: boolean;
  extensionAddress: any;

  constructor(private localStorageService: LocalStorageService, 
    private smartAccountService : SmartAccountService,
    private extensionService : ExtensionService,
    private router: Router,
    private zone : NgZone) { }

  ngOnInit() {
    this.back();
  }

  back() {
    this.showList = true;
    this.showIdentifiers = false;
    this.selectedExtension = undefined;
    this.selectedActive = false;
    this.showNew = false;
    this.executing = false;
  }

  isActive(address: string): boolean {
    for(let i = 0; i < this.extensionList.length; ++i) {
      if (this.extensionList[i].address == address) {
        return true;
      }
    }
    return false;
  }

  getName(address: string): string {
    let ui = this.localStorageService.getAccountData().getExtensionUI(address);
    return ui ? ui.name : address.substr(0, 20) + "...";
  }

  extensionDetails(address: string) {
    for(let i = 0; i < this.allExtensions.length; ++i) {
      if (this.allExtensions[i].address == address) {
        this.selectedExtension = this.allExtensions[i];
        this.selectedActive = this.isActive(address);
        break;
      }
    }
    this.showIdentifiers = true;
    this.showList = false;
    this.showNew = false;
  }

  setNewConfiguration() {
    this.zone.run(() => this.router.navigate(['extension-setup', this.smartAccountAddress, this.selectedExtension.address]));
  }

  loadCustomExtension() {
    if (this.extensionAddress && this.extensionAddress.status) {
      this.executing = true;
      let self = this;
      let accountData = this.localStorageService.getAccountData();
      let ui = accountData.getExtensionUI(this.extensionAddress.value);
      if (!ui) {
        this.extensionService.getExtension(this.extensionAddress.value).subscribe(ret => {
          self.executing = false;
          if (ret) {
            accountData.setExtensionUI(ret);
            self.localStorageService.setAccountData(accountData);
            self.goToExtension();
          }
        });
      } else {
        this.executing = false;
        this.goToExtension();
      }
    }
  }

  setNewExtension() {
    this.selectedExtension = new ExtensionStorage();
    this.selectedActive =  false;
    this.showIdentifiers = false;
    this.showList = false;
    this.showNew = true;
    this.executing = false;
    this.extensionAddress = null;
  }

  goToIdentifier(identifier: string) {
    this.zone.run(() => this.router.navigate([ 'extension-instance', this.smartAccountAddress, this.selectedExtension.address, identifier ]));
  }

  onChangeActiveStatus(active: boolean) {
    this.goToExtension();
  }

  goToExtension() {
    this.zone.run(() => this.router.navigate([ 'extension', this.smartAccountAddress, this.selectedExtension.address ]));
  }

  getIndex(): number {
    return 0;
  }

  getExtensionAddressParameter(): ParameterUI {
    return new ParameterUI("Extension Address", 3, 0, false, true, false);
  }

  setExtensionAddress(address: any) {
    this.extensionAddress = address;
  }
}
