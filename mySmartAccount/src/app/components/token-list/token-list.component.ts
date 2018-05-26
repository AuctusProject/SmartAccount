import { Component, OnInit } from '@angular/core';
import { TokenBalance } from '../../model/TokenBalance';
import { TokenListVariables } from '../../model/TokenListVariables';
import { LocalStorageService } from '../../services/local-storage.service';



@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.css']
})
export class TokenListComponent implements OnInit {

  variables = new TokenListVariables();
  tokenBalanceList : TokenBalance[] = new Array<TokenBalance>();
  
  constructor(private localStorageService : LocalStorageService) { }

  ngOnInit() {
    let tokenList : TokenBalance[] = JSON.parse(this.localStorageService.getLocalStorage("token_list"));
    if (tokenList != null){
      tokenList.forEach(element => {
        this.tokenBalanceList.push(new TokenBalance(element.symbol, this.checkTokenBalance(element.contractAddress)));
      });
    }
  }

  checkTokenBalance(address: string) : number{
    return 0;
  }

  updateFrame(variables : TokenListVariables){
    this.variables = variables;
  }

  showListFrame(){
    this.variables = new TokenListVariables();
  }

}
