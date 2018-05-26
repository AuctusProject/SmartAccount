import { Component, OnInit } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private smartAccountService: SmartAccountService, private router : Router) {
  }

  ngOnInit() {
  }

  onCreateAccount() {
    this.smartAccountService.createAccountSC().subscribe(contractAddress => {
      this.router.navigate(['account']);
    })
  }
}
