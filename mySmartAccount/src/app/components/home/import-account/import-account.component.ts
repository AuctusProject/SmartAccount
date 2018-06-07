import { Component, OnInit, Input } from '@angular/core';
import { SmartAccountService } from '../../../services/smart-account.service';
import { Router } from '@angular/router';
//import { SmartAccount } from '../../../model/SmartAccount';

@Component({
  selector: 'app-import-account',
  templateUrl: './import-account.component.html',
  styleUrls: ['./import-account.component.css']
})
export class ImportAccountComponent implements OnInit {

  contractAddress: string;

  constructor(private smartAccountService: SmartAccountService,
    private router: Router) { }

  ngOnInit() {
  }

  public import() {
    if (this.contractAddress) {
      this.smartAccountService.getSmartAccountVersion(this.contractAddress);
      this.smartAccountService.getSmartAccountVersion(this.contractAddress).subscribe(ret => {
        if (ret) {
          this.router.navigate(['/account', this.contractAddress])
        }
      });
    }
  }
}
