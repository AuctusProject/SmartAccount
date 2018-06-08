import { Component, OnInit, Input } from '@angular/core';
import { AddressUtil } from '../../../util/addressUtil';
import { SmartAccountService } from '../../../services/smart-account.service';

@Component({
  selector: 'app-eth-balance',
  templateUrl: './eth-balance.component.html',
  styleUrls: ['./eth-balance.component.css']
})
export class EthBalanceComponent implements OnInit {

  @Input() smartAccountAddress: string;
  @Input() ethBalance: number;
  recipient: string;
  value: number;
  executing: boolean;

  constructor(private smartAccountService: SmartAccountService) {
  }

  ngOnInit() {
  }

  transferEth() {
    if (this.smartAccountAddress && this.recipient && this.value && AddressUtil.isValid(this.recipient)) {
      this.executing = true;
      let self = this;
      this.smartAccountService.sendEther(this.smartAccountAddress, this.recipient, this.value).subscribe(ret => {
        self.executing = false;
      });
    }
  }

}
