import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Extension } from '../../model/Extension';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-extension-edit',
  templateUrl: './extension-edit.component.html',
  styleUrls: ['./extension-edit.component.css']
})
export class ExtensionEditComponent implements OnInit {

  extension : Extension;

  constructor(private route: ActivatedRoute, private localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.extension = JSON.parse(this.localStorageService.getLocalStorage("extension_"+params['address']));
   });
  }
}
