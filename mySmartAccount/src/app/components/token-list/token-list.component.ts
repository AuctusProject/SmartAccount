import { Component, OnInit } from '@angular/core';
import { TokenBalance } from '../../model/TokenBalance';
import { TokenListVariables } from '../../model/TokenListVariables';
import { LocalStorageService } from '../../services/local-storage.service';
import { SmartAccountService } from '../../services/smart-account.service';


@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.css']
})
export class TokenListComponent implements OnInit {

  variables = new TokenListVariables();
  tokenBalanceList: TokenBalance[] = new Array<TokenBalance>();

  constructor(
    private localStorageService: LocalStorageService,
    private smartAccountServiec: SmartAccountService) { }

  ngOnInit() {
    let tokenList: TokenBalance[] = JSON.parse(this.localStorageService.getLocalStorage("token_list"));
    if (tokenList != null) {
      tokenList.forEach(element => {
        this.checkTokenBalance(element.contractAddress, element.symbol);
      });
    }
  }

  checkTokenBalance(address: string, symbol: string) {
    let value = this.smartAccountServiec.getAccountTokenBalance(address, symbol, this.pushTokenBalance, this);

  }

  public pushTokenBalance(err, value?: number, symbol?: string, address?: string, caller?) {
    if (value != undefined && value != null) {
      caller.tokenBalanceList.push(new TokenBalance(symbol, value, address));
    }
  }

  updateFrame(variables: TokenListVariables) {
    this.variables = variables;
  }

  showListFrame() {
    this.variables = new TokenListVariables();
  }

}
