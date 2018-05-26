import { Component, OnInit } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private smartAccountService : SmartAccountService) { }

  ngOnInit() {

  }
}
