import { Component, OnInit } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { SmartAccount } from '../../model/SmartAccount';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  smartAccount : SmartAccount;

  constructor(private smartAccountService : SmartAccountService) { }

  ngOnInit() {
    this.smartAccount = new SmartAccount(this.smartAccountService.getContractAddress());
  }
}
