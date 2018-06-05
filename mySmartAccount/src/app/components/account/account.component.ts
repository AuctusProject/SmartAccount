import { Component, OnInit } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { SmartAccount } from '../../model/SmartAccount';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  smartAccount : SmartAccount;

  constructor(private smartAccountService : SmartAccountService, private router : Router) { }

  ngOnInit() {
    this.smartAccount = new SmartAccount(this.smartAccountService.getContractAddress());
  }

  logoff(){
    this.smartAccountService.removeSmartAccount();
    this.router.navigate(['home']);
  }
}
