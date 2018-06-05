import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Extension } from '../../model/Extension';
import { LocalStorageService } from '../../services/local-storage.service';
import { ExtensionService } from '../../services/extension.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionData } from '../../model/ExtensionData';

@Component({
  selector: 'app-extension-edit',
  templateUrl: './extension-edit.component.html',
  styleUrls: ['./extension-edit.component.css']
})
export class ExtensionEditComponent implements OnInit {

  extension: Extension;
  extensionData: ExtensionData = new ExtensionData();
  loading: boolean;

  constructor(private route: ActivatedRoute, private zone: NgZone,
    private localStorageService: LocalStorageService,
    private extensionService: ExtensionService,
    private smartAccountService: SmartAccountService) { }

  ngOnInit() {
    var self = this;
    this.route.params.subscribe(params => {
      var address = params['address'];
      this.extension = this.extensionService.getExtensionByAddress(address);
      var active = this.extension.active;
      this.loading = true;
      this.extensionService.getExtension(this.extension.address).subscribe(result => {
        self.zone.run(() => {
          self.extension = result;
          self.extension.active = active;
          self.formatParameters();
          self.loading = false;
        })
      });
    });
  }

  // just for showcasing, this need to be read from smart contract
  formatParameters() {
    if (this.extension.address == "0x05D1D91B68C20032c09265FC14a5c9e1Ddf08341") {//recurrent payment
      this.extension.viewDataParameters[0].value = "10";
      this.extension.viewDataParameters[1].value = "20";
      this.extension.viewDataParameters[2].value = "5";
    }
    else { // fund recovery
      this.extension.viewDataParameters[0].value = "true";
      this.extension.viewDataParameters[1].value = "0xf4092Ed107D7183D37Be89E6251264A363aC360A".substring(0, 10)+"...";
      this.extension.viewDataParameters[2].value = "5";
      this.extension.viewDataParameters[3].value = "60000";
    }
  }

  onChangeActiveStatus(active) {
    this.extension.active = active;
    this.extensionService.updateExtension(this.extension);
  }
}
