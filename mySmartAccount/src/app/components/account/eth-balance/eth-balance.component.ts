import { Component, OnInit, Input } from '@angular/core';
import { AddressUtil } from '../../../util/addressUtil';
import { SmartAccountService } from '../../../services/smart-account.service';
import { ParameterUI } from '../../../model/ParameterUI';
import { Web3Service } from '../../../services/web3.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-eth-balance',
  templateUrl: './eth-balance.component.html',
  styleUrls: ['./eth-balance.component.css']
})
export class EthBalanceComponent implements OnInit {

  @Input() smartAccountAddress: string;
  @Input() ethBalance: number;
  recipient: any;
  value: any;
  promise: Subscription;

  constructor(private smartAccountService: SmartAccountService,
    private web3Service: Web3Service) {
  }

  ngOnInit() {
  }

  transferEth() {
    if (this.smartAccountAddress && this.recipient && this.recipient.status && this.value && this.value.status && this.value.value > 0) {
      let self = this;
      this.promise = this.smartAccountService.sendEther(this.smartAccountAddress, this.recipient.value, this.value.value).subscribe(txHash => {
        self.web3Service.isSuccessfullyMinedTransaction(txHash).subscribe(ret => {
          if (ret) {
            self.smartAccountService.getETHBalance(self.smartAccountAddress).subscribe(ret => {
              self.ethBalance = ret;
            });
          } else {
            //TODO: failed message
          }
        });
      });
    } else {
      //TODO: invalid input message
    }
  }

  getRecipientIndex(): number {
    return 0;
  }

  getRecipientParameter(): ParameterUI {
    return new ParameterUI("Recipient Address", 3, 0, false, true, false);
  }

  setRecipientAddress(address: any) {
    this.recipient = address;
  }

  getAmountIndex(): number {
    return 1;
  }

  getAmountParameter(): ParameterUI {
    return new ParameterUI("Amount", 2, 1000000000000000000, false, true, false);
  }

  setAmount(amount: any) {
    this.value = amount;
  }
}
