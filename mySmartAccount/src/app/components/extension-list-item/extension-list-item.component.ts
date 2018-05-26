import { Component, OnInit, Input } from '@angular/core';
import { Extension } from '../../model/Extension';

@Component({
  selector: 'app-extension-list-item',
  templateUrl: './extension-list-item.component.html',
  styleUrls: ['./extension-list-item.component.css']
})
export class ExtensionListItemComponent implements OnInit {

  @Input() extension : Extension;

  constructor() { }

  ngOnInit() {
  }

}
