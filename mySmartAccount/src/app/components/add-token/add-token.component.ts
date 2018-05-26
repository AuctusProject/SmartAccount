import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { AddTokenVariables } from '../../model/AddTokenVariables';
import { AddressUtil } from '../../util/addressUtil';
import { TokenBalance } from '../../model/TokenBalance';


@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.css']
})
export class AddTokenComponent implements OnInit {

  public variables: AddTokenVariables = new AddTokenVariables();

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService) {

  }

  ngOnInit() {
  }

  public add() {
    if (this.validate()) {
      if (this.insertToken()) {
        alert("Token Added");
        this.router.navigate(['../']);
      }
      else
        alert("Contract already addedd.");
    }
  }

  private insertToken(): boolean {
    let tokensJson: TokenBalance[] = JSON.parse(this.localStorageService.getLocalStorage("token_list"));
    if (tokensJson == null){
      tokensJson = new Array<TokenBalance>();
    }
    
    let alreadyInserted: boolean = false;
    tokensJson.forEach(element => {
      if (element.contractAddress === this.variables.contractAddress) {
        alreadyInserted = true;
      }
    });
    if (alreadyInserted) {
      return false;
    }
    else {
      tokensJson.push(new TokenBalance(this.variables.symbol, 0, this.variables.contractAddress));
      this.localStorageService.setLocalStorage("token_list", JSON.stringify(tokensJson));
      return true;
    }
  }

  private validate(): boolean {
    if (!AddressUtil.isValid(this.variables.contractAddress)) {
      alert("Invalid Contract Address");
      return false;
    }
    if (this.variables.symbol == null || this.variables.symbol === "") {
      alert("Invalid Symbol");
      return false;
    }
    if (this.variables.decimals == null || this.variables.decimals < 0) {
      alert("Invalid Decimal");
      return false;
    }

    return true;
  }

}
