import { Component, OnInit } from '@angular/core';
import { Extension } from '../../model/Extension';
import { LocalStorageService } from '../../services/local-storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.css']
})
export class ExtensionListComponent implements OnInit {

  extensionList : string[];

  constructor(private localStorageService : LocalStorageService) { }

  ngOnInit() {

    this.extensionList = environment.extensions;

    this.extensionList.forEach(extensionAddress => {
      var ext = new Extension(extensionAddress);
      this.localStorageService.setLocalStorage("extension_"+ext.address, ext);
    });
  }

}
