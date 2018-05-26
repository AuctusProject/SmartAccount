import { Component, OnInit, Input } from '@angular/core';
import { SmartAccountService } from '../../../services/smart-account.service';
import { Router } from '@angular/router';
import { SmartAccount } from '../../../model/SmartAccount';

@Component({
  selector: 'app-import-account',
  templateUrl: './import-account.component.html',
  styleUrls: ['./import-account.component.css']
})
export class ImportAccountComponent implements OnInit {

  private account: SmartAccount = new SmartAccount();

  constructor(private smartAccountService: SmartAccountService,
    private router: Router) { }

  ngOnInit() {
  }

  public import() {
    if (this.account.contractAddress) {
      this.smartAccountService.setSmartAccount(this.account.contractAddress);
      this.router.navigate(['/account', this.account.contractAddress])
    }
  }
}
