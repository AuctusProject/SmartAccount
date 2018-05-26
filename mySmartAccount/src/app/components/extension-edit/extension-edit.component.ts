import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Extension } from '../../model/Extension';
import { LocalStorageService } from '../../services/local-storage.service';
import { ExtensionService } from '../../services/extension.service';

@Component({
  selector: 'app-extension-edit',
  templateUrl: './extension-edit.component.html',
  styleUrls: ['./extension-edit.component.css']
})
export class ExtensionEditComponent implements OnInit {

  extension : Extension;

  constructor(private route: ActivatedRoute, private localStorageService : LocalStorageService, private extensionService : ExtensionService) { }

  ngOnInit() {
    var self = this;
    this.route.params.subscribe(params => {
      var extensionAddress = JSON.parse(this.localStorageService.getLocalStorage("extension_"+params['address']));
      this.extensionService.getExtension(extensionAddress.address).subscribe(result => {
        self.extension = result;
      });
   });
  }
}
