import { Component, OnInit, Input } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @Input() smartAccountAddress: string;
  
  constructor(private smartAccountService : SmartAccountService, private router : Router) { }

  ngOnInit() {
  }

  logoff(){
    this.router.navigate(['home']);
  }
}
