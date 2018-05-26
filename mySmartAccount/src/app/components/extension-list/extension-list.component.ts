import { Component, OnInit } from '@angular/core';
import { Extension } from '../../model/Extension';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.css']
})
export class ExtensionListComponent implements OnInit {

  extensionList : Extension[] = new Array<Extension>();

  constructor() { }

  ngOnInit() {

    this.extensionList.push(new Extension("Fund Recovery", "Recover your funds in case you lose the private key"));
  }

}
