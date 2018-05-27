import { Component, OnInit } from '@angular/core';
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

  extension : Extension;
  extensionData: ExtensionData = new ExtensionData();

  constructor(private route: ActivatedRoute, 
    private localStorageService : LocalStorageService,
    private extensionService : ExtensionService,
    private smartAccountService: SmartAccountService) { }

  ngOnInit() {
    var self = this;
    this.route.params.subscribe(params => {
      var extensionAddress = JSON.parse(this.localStorageService.getLocalStorage("extension_"+params['address']));
      this.extensionService.getExtension(extensionAddress.address).subscribe(result => {
        self.extension = result;
        
        self.extensionService.getSetupData(self.smartAccountService.getContractAddress(), 
        self.extension.address, self.extension.returnSetupTypes()).subscribe(ret => {
          self.extensionData.addSetupParameters(ret);
        });
      });
   });
  }
}
