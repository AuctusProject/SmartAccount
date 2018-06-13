import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionData } from '../../model/ExtensionData';
import { Router } from '@angular/router';
import { ExtensionStorage } from '../../model/ExtensionStorage';
import { ExtensionUI } from '../../model/ExtensionUI';

@Component({
  selector: 'app-extension-setup',
  templateUrl: './extension-setup.component.html',
  styleUrls: ['./extension-setup.component.css']
})
export class ExtensionSetupComponent implements OnInit {

  smartAccountAddress: string;
  extensionAddress: string;
  ui: ExtensionUI;

  constructor(private route: ActivatedRoute, 
    private zone: NgZone, 
    private router: Router,
    private localStorageService: LocalStorageService,
    private smartAccountService: SmartAccountService) { }
    
  ngOnInit() {
    let self = this;
    this.route.params.subscribe(params => {
      self.smartAccountAddress = params["smartaccountaddress"];
      self.extensionAddress = params["extensionaddress"];
      if (!self.smartAccountAddress || !self.extensionAddress) {
        self.zone.run(() => self.router.navigate(['home']));
      } else {
        this.ui = self.localStorageService.getAccountData().getExtensionUI(this.extensionAddress);
      }
    });
  }

  getFunctionSignature() {

  }

  getParameters() {

  }

  getValues() {
      
  }
}
