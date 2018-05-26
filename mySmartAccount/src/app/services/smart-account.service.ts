import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'angular-event-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// import { constants } from '../util/contants';
import { Web3Service } from "./web3.service";

declare let window: any;

@Injectable()
export class SmartAccountService {

  public hasMetamask: boolean;
  private account: string;
  private network: number;

  constructor(private router: Router, private eventsService: EventsService, private web3Service: Web3Service) {
    this.runChecks();
    this.monitoreAccount();
  }

  private monitoreAccount() {
    let self = this;
    var accountInterval = setInterval(function () {
      self.web3Service.getAccount().subscribe(
        account => {
          if (!self.getNetwork()){
            return;
          }
          if (!self.isRinkeby()){
            self.broadcastLoginConditionsFail();
            return;
          }

          if (self.account && self.account != account) {
            self.broadcastAccountChanged(account);
          }
          self.account = account;
        })
    }, 100);
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
          self.checkAccountAndNetwork().subscribe(success => {});
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
            if (!self.network || !self.account || !self.isRinkeby()) {
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

  public isRinkeby(): boolean {
    return this.network && this.network == 4;
  }

  public getNetwork(): number {
    return this.network;
  }

  private createAccountSC(){
    this.web3Service.sendTransaction(1, 3000000, this.getAccount(), "", 0, 
      environment.smartAccountSCData, environment.chainId).subscribe(txId => {
        console.log(txId);
      });
  }

  getAccountETHBalance(): any {
    
  }

}
