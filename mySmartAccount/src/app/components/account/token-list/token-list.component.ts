import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SmartAccountService } from '../../../services/smart-account.service';
import { TokenStorage } from '../../../model/TokenStorage';
import { AddressUtil } from '../../../util/addressUtil';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.css']
})
export class TokenListComponent implements OnInit {

  @Input() tokenBalanceList: TokenStorage[];
  @Input() smartAccountAddress: string;
  showTransfer: boolean;
  showList: boolean;
  showAdd: boolean;
  executing: boolean;
  contractAddress: string;
  symbol: string;
  decimals: number;
  toAddress: string;
  amount: number;
  selectedToken: TokenStorage;

  constructor(
    private localStorageService: LocalStorageService,
    private smartAccountService: SmartAccountService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.cancel();
  }

  cancel() {
    this.showTransfer = false;
    this.showList = true;
    this.showAdd = false;
    this.clearAll();
  }

  clearAll() {
    this.executing = false;
    this.contractAddress = "";
    this.symbol = "";
    this.toAddress = "";
    this.selectedToken = null;
    this.amount = null;
    this.decimals = null;
    this.executing = false;
  }

  setNewToken() {
    this.showTransfer = false;
    this.showList = false;
    this.showAdd = true;
    this.clearAll();
  }

  addToken() {
    if (this.contractAddress && this.decimals > 0 && this.symbol && AddressUtil.isValid(this.contractAddress)) {
      this.executing = true;
      let accountData = this.localStorageService.getAccountData();
      let smartAccount = accountData.getSmartAccount(this.smartAccountAddress);
      smartAccount.addTokenData(this.symbol.toUpperCase(), this.decimals, this.contractAddress.toLowerCase());
      this.tokenBalanceList = smartAccount.tokens;
      accountData.updateSmartAccount(smartAccount);
      this.localStorageService.setAccountData(accountData);
      let self = this;
      this.smartAccountService.getTokenBalance(this.smartAccountAddress, this.contractAddress, this.decimals).subscribe(ret => {
        self.updateBalance(self.contractAddress, ret);
        self.cancel();
      });
    }
  }

  setTransferToken(address: string) {
    for(let i = 0; i < this.tokenBalanceList.length; ++i) {
      if (this.tokenBalanceList[i].address == address) {
        this.selectedToken = this.tokenBalanceList[i];
        break;
      }
    }
    this.showTransfer = true;
    this.showList = false;
    this.showAdd = false;
  }

  transferToken() {
    if (this.toAddress && AddressUtil.isValid(this.toAddress) && this.amount > 0) {
      this.executing = true;
      let self = this;
      this.smartAccountService.transferToken(this.smartAccountAddress, this.selectedToken.address, 
        this.toAddress, this.amount, this.selectedToken.decimals).subscribe(ret => {
          self.cancel();
      });
    }
  }

  removeToken(address: string) {
    if (address && AddressUtil.isValid(address)) {
      let accountData = this.localStorageService.getAccountData();
      let smartAccount = accountData.getSmartAccount(this.smartAccountAddress);
      smartAccount.removeTokenData(address);
      this.tokenBalanceList = smartAccount.tokens;
      accountData.updateSmartAccount(smartAccount);
      this.localStorageService.setAccountData(accountData);
    }
  }

  updateBalance(tokenAddress: string, balance: number) {
    for(let i = 0; i < this.tokenBalanceList.length; ++i) {
      if (this.tokenBalanceList[i].address == tokenAddress) {
        this.tokenBalanceList[i]["balance"] = balance;
        break;
      }
    }
  }
}
