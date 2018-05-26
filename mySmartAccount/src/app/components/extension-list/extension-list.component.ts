import { Component, OnInit } from '@angular/core';
import { Extension } from '../../model/Extension';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.css']
})
export class ExtensionListComponent implements OnInit {

  extensionList : Extension[] = new Array<Extension>();

  constructor(private localStorageService : LocalStorageService) { }

  ngOnInit() {

    this.extensionList.push(
      new Extension("0xb235a368778d2aBc51765B7522233E6dd40D4133", "Fund Recovery", "Recover your funds in case you lose the private key"),
      new Extension("0xb235a368778d2aBc51765B7522233E6dd40D4133", "Testament", "Transfer your funds to your children in case you die")
    );

    this.extensionList.forEach(extension => {
      this.localStorageService.setLocalStorage("extension_"+extension.address, extension);
    });
  }

}
