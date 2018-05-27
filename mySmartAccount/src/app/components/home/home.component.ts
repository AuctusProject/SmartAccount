import { Component, OnInit, NgZone } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  creating: boolean;
  importing: boolean;
  
  constructor(private smartAccountService: SmartAccountService, private router: Router, private zone : NgZone) {
  }

  ngOnInit() {
  }

  onCreateAccount() {
    this.creating = true;
    this.smartAccountService.createAccountSC().subscribe(contractAddress => {
      this.creating = false;
      if (contractAddress) {
        this.zone.run(() => this.router.navigate(['/account', contractAddress]));
      }
    })
  }
}
