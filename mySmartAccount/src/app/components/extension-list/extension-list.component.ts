import { Component, OnInit } from '@angular/core';
import { Extension } from '../../model/Extension';
import { LocalStorageService } from '../../services/local-storage.service';
import { environment } from '../../../environments/environment';
import { ExtensionService } from '../../services/extension.service';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.css']
})
export class ExtensionListComponent implements OnInit {

  extensionList: Extension[];

  constructor(private localStorageService: LocalStorageService, private extensionService : ExtensionService) { }

  ngOnInit() {
    this.extensionList = this.extensionService.getExtensionList();
  }

}
