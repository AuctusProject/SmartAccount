import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'angular-event-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// import { constants } from '../util/contants';
import { Web3Service } from "./web3.service";
import { LocalStorageService } from './local-storage.service';

declare let window: any;

@Injectable()
export class SmartAccountService {

  public hasMetamask: boolean;
  private account: string;
  private contractAddress: string;
  private network: number;
  private smartAccountAddress: string;

  constructor(private router: Router, private eventsService: EventsService, private web3Service: Web3Service, private localStorageService: LocalStorageService) {
    this.runChecks();
    this.monitoreAccount();
  }

  private monitoreAccount() {
    let self = this;
    this.web3Service && this.web3Service.getAccount().subscribe(
      account => {
        if (!self.getNetwork()) {
          return;
        }
        if (!self.isCorrectNetwork()) {
          self.broadcastLoginConditionsFail();
          return;
        }

        if (self.account && self.account != account) {
          self.broadcastAccountChanged(account);
        }
        self.account = account;
      });
    setTimeout(this.monitoreAccount, 5000);
  }

  private runChecks() {
    let self = this;
    this.web3Service.getWeb3().subscribe(
      web3 => {
        self.hasMetamask = web3 != null;
        if (!web3) {
          self.broadcastLoginConditionsFail();
        }
        else {
          self.checkAccountAndNetwork().subscribe(success => { });
        }
      })
  }

  private checkAccountAndNetwork(): Observable<boolean> {
    let self = this;
    return new Observable(
      observer => {
        Observable.combineLatest(this.web3Service.getNetwork(), this.web3Service.getAccount())
          .subscribe(function handleValues(values) {
            self.network = values[0];
            self.account = values[1];
            if (!self.network || !self.account || !self.isCorrectNetwork()) {
              observer.next(false);
              self.broadcastLoginConditionsFail();
            }
            else {
              self.broadcastLoginConditionsSuccess();
              observer.next(true);
            }
          });
      });
  }

  private broadcastBalanceChanged(balance) {
    this.eventsService.broadcast("balanceChanged", balance);
  }

  private broadcastAccountChanged(account) {
    this.eventsService.broadcast("accountChanged", account);
  }

  private broadcastLoginConditionsFail() {
    this.eventsService.broadcast("loginConditionsFail");
  }

  private broadcastLoginConditionsSuccess() {
    this.eventsService.broadcast("loginConditionsSuccess");
  }

  public getAccount(): string {
    return this.account;
  }

  public isCorrectNetwork(): boolean {
    return this.network && this.network == Number.parseInt(environment.chainId);
  }

  public getNetwork(): number {
    return this.network;
  }

  public createAccountSC(): Observable<any> {
    if (!this.getAccount()) {
      return new Observable(observer => {
        observer.next(null);
      });
    }

    var self = this;
    return new Observable(observer => {
      this.web3Service.sendTransaction(1000000000, 3000000, this.getAccount(), "", 0,
        environment.smartAccountSCData, environment.chainId).subscribe(txHash => {
          if (txHash) {

            Observable.interval(1000 * 5).subscribe(x => {
              this.web3Service.getTransactionReceipt(txHash).subscribe(
                receipt => {
                  if (receipt) {
                    self.setSmartAccount(receipt.contractAddress);
                    observer.next(receipt.contractAddress);
                  }
                })
            });
          }
          else {
            observer.next(null);
          }
        });
    })
  }

  public setSmartAccount(contractAddress: string) {
    this.localStorageService.setLocalStorage("smartAccountAddress", contractAddress);
    this.contractAddress = contractAddress;
  }

  public getAccountETHBalance(): any {
    return this.web3Service.getETHBalance(this.getContractAddress());
  }

  public getAccountTokenBalance(tokenAddress : string, symbol: string, cb) {
    let self = this;
    this.web3Service.getWeb3().subscribe( web3 => {
        self.web3Service.getTokenBalance(tokenAddress, this.getContractAddress(), cb, symbol);
    });
  }

  public getContractAddress() {
    var address = this.contractAddress;
    if (!address) {
      this.contractAddress, address = this.localStorageService.getLocalStorage("smartAccountAddress");
    }
    return address;
  }
}
