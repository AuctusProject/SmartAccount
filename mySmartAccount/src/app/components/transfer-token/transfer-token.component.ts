import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TokenListVariables } from '../../model/TokenListVariables';
import { TransferTokensVariables } from '../../model/TransferTokensVariable';
import { SmartAccountService } from '../../services/smart-account.service';

@Component({
  selector: 'app-transfer-token',
  templateUrl: './transfer-token.component.html',
  styleUrls: ['./transfer-token.component.css']
})
export class TransferTokenComponent implements OnInit {

  transferVariables = new TransferTokensVariables();
  @Input() contractAddress = "";
  @Output() returnEvent = new EventEmitter();

  constructor(private smartAccountService: SmartAccountService) { }

  ngOnInit() {

  }

  public transferToken() {
    this.smartAccountService.sendToken(
      this.contractAddress,
      this.transferVariables.toAddress,
      this.transferVariables.amount * (10**18)
      , this.callBack, this);
  }

  public callBack(amount, caller) {
    caller.returnEvent.emit();
  }

  cancel() {
    this.returnEvent.emit();
  }
}
