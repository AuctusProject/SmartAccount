import { Component, OnInit, Input, NgZone } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { SmartAccountService } from '../../../services/smart-account.service';
import { ExtensionStorage } from '../../../model/ExtensionStorage';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.css']
})
export class ExtensionListComponent implements OnInit {

  @Input() extensionList: ExtensionStorage[];
  @Input() smartAccountAddress: string;
  allExtensions: ExtensionStorage[];
  showList: boolean;
  showIdentifiers: boolean;
  selectedExtension: ExtensionStorage;
  selectedActive: boolean;

  constructor(private localStorageService: LocalStorageService, 
    private smartAccountService : SmartAccountService,
    private router: Router,
    private zone : NgZone) { }

  ngOnInit() {
    this.allExtensions = this.localStorageService.getAccountData().getSmartAccount(this.smartAccountAddress).getAllExtensionList(this.smartAccountService.getNetwork());
    this.back();
  }

  back() {
    this.showList = true;
    this.showIdentifiers = false;
    this.selectedExtension = undefined;
    this.selectedActive = false;
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
  }

  setNewConfiguration() {
  }

  setNewExtension() {
  }

  goToIdentifier() {
  }

  onChangeActiveStatus(active: boolean) {
    this.zone.run(() => this.router.navigate(['extension', this.smartAccountAddress, this.selectedExtension.address ]));
  }
}
