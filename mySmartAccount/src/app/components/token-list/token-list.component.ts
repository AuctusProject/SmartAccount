import { Component, OnInit } from '@angular/core';
import { TokenBalance } from '../../model/TokenBalance';
import { TokenListVariables } from '../../model/TokenListVariables';



@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.css']
})
export class TokenListComponent implements OnInit {

  variables = new TokenListVariables();
  tokenBalanceList : TokenBalance[] = new Array<TokenBalance>();
  
  constructor() { }

  ngOnInit() {
    this.tokenBalanceList.push(new TokenBalance("AUC", 1406));
    this.tokenBalanceList.push(new TokenBalance("ANT", 2342));
    this.tokenBalanceList.push(new TokenBalance("DAI", 666));
  }

  updateFrame(variables : TokenListVariables){
    this.variables = variables;
  }

  showListFrame(){
    this.variables = new TokenListVariables();
  }

}
