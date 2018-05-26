import { Component, OnInit } from '@angular/core';
import { SmartAccountService } from '../../../services/smart-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-account',
  templateUrl: './import-account.component.html',
  styleUrls: ['./import-account.component.css']
})
export class ImportAccountComponent implements OnInit {

  address : string;

  constructor(private smartAccountService : SmartAccountService,
              private router : Router) { }

  ngOnInit() {
  }

  import(){
    if (this.address){
      this.smartAccountService.setSmartAccount(this.address);
      this.router.navigate(['account'])
    }
  }
}
