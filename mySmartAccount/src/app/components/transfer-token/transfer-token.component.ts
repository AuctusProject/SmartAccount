import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TokenListVariables } from '../../model/TokenListVariables';

@Component({
  selector: 'app-transfer-token',
  templateUrl: './transfer-token.component.html',
  styleUrls: ['./transfer-token.component.css']
})
export class TransferTokenComponent implements OnInit {


  @Output() returnEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  transferToken(){
    this.returnEvent.emit();
  }

  cancel(){
    this.returnEvent.emit();
  }
}
