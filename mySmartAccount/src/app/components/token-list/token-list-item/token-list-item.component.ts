import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenBalance } from '../../../model/TokenBalance';
import { TokenListVariables } from '../../../model/TokenListVariables';
import { VariableAst } from '@angular/compiler';

@Component({
  selector: 'app-token-list-item',
  templateUrl: './token-list-item.component.html',
  styleUrls: ['./token-list-item.component.css']
})
export class TokenListItemComponent implements OnInit {

  @Input() tokenBalance : TokenBalance;
  @Output() selectedTokenEvent = new EventEmitter<TokenListVariables>();

  constructor() { 

  }

  ngOnInit() {


  }

  public transferTokens(){
    let variables = new TokenListVariables();
    variables.selectedToken = this.tokenBalance.symbol;
    variables.showList = false;
    
    this.selectedTokenEvent.emit(variables);
  }
}
