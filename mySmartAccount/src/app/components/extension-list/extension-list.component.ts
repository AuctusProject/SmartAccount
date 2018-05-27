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

  extensionList : Extension[];

  constructor(private localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.extensionList = [
      new Extension("0x0d891cfa793d69169be13dca6a259dd82e58e0d7", "Recurrent Payment"),
      new Extension("0x349ac81327c01a21d48e4bfd8790ef51817ef85d", "Fund Recovery")
    ]

    this.extensionList.forEach(extension => {
      this.localStorageService.setLocalStorage("extension_"+extension.address, extension);
    });
  }

}
