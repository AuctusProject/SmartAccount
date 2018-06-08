import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';

@Component({
  selector: 'app-transfer-token',
  templateUrl: './transfer-token.component.html',
  styleUrls: ['./transfer-token.component.css']
})
export class TransferTokenComponent implements OnInit {

  @Input() contractAddress = "";
  @Output() returnEvent = new EventEmitter();

  constructor(private smartAccountService: SmartAccountService) { }

  ngOnInit() {

  }

  public transferToken() {
    /*
    this.smartAccountService.sendToken(
      this.contractAddress,
      this.transferVariables.toAddress,
      this.transferVariables.amount * (10**18)
      , this.callBack, this);*/
  }

  public callBack(amount, caller) {
    caller.returnEvent.emit();
  }

  cancel() {
    this.returnEvent.emit();
  }
}
