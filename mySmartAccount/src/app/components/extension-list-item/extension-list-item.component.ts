import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-extension-list-item',
  templateUrl: './extension-list-item.component.html',
  styleUrls: ['./extension-list-item.component.css']
})
export class ExtensionListItemComponent implements OnInit {

  //@Input() extension : Extension;

  constructor(private router: Router, private zone: NgZone) { }

  ngOnInit() {
  }

  navigate(){
    //this.zone.run(() => this.router.navigate(['extension', this.extension.address.toString()]));
  }
}
