import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'angular-event-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Web3Service } from "./web3.service";
import { LocalStorageService } from './local-storage.service';
import { Subscriber } from 'rxjs';
import { AccountDataStorage } from '../model/AccountDataStorage';
import { ExtensionStorage } from '../model/ExtensionStorage';

declare let window: any;

@Injectable()
export class SmartAccountService {

  public hasWeb3: boolean;
  private account: string;
  private network: string;

  constructor(private router: Router, 
    private eventsService: EventsService, 
    private web3Service: Web3Service, 
    private localStorageService: LocalStorageService) {
      this.runChecks();
      this.monitoreAccount();
  }

  ngOnInit() {
  }

  private monitoreAccount() {
    let self = this;
    self.web3Service && self.web3Service.getAccount().subscribe(
      account => {
        if (!self.getNetwork()) {
          return;
        }
        if (self.account != account) {
          self.account = account;
          self.broadcastAccountChanged(account);
        }
      });
    setTimeout(() => this.monitoreAccount(), 2000);
  }

  startWeb3() {
    return this.web3Service.hasWeb3();
  }

  private runChecks() {
    let self = this;
    self.web3Service.hasWeb3().subscribe(web3 => {
        self.hasWeb3 = web3;
        if (!web3) {
          self.broadcastLoginConditionsFail();
        } else {
          self.checkAccountAndNetwork().subscribe(success => { });
        }
      });
  }

  private checkAccountAndNetwork(): Observable<boolean> {
    let self = this;
    return new Observable(observer => {
        Observable.combineLatest(this.web3Service.getNetwork(), this.web3Service.getAccount())
          .subscribe(function handleValues(values) {
            self.network = values[0];
            self.account = values[1];
            if (!self.network || !self.account) {
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

  public getNetwork(): string {
    return this.network;
  }

  public createAccountSC(): Observable<any> {
    if (!this.getAccount()) {
      return new Observable(observer => {
        observer.next(null);
      });
    }

    let self = this;
    return new Observable(observer => {
      self.web3Service.sendTransaction(self.getAccount(), "", 0, environment.smartAccountSCData, environment.defaultGasPrice, 3300000, self.getNetwork())
        .subscribe(txHash => {
          if (txHash) {
            self.monitoringSmartAccountCreation(observer, txHash);
          }
          else {
            observer.next(null);
          }
        });
    });
  }

  private sendCreateSmartAccountTransaction(): Observable<string> {
    var self = this;
    return new Observable(observer => {
      self.web3Service.sendTransaction(self.getAccount(), "", 0, environment.smartAccountSCData, environment.defaultGasPrice, 3300000, self.getNetwork())
        .subscribe(txHash => {
          if (txHash) {
            self.monitoringSmartAccountCreation(observer, txHash);
          } else {
            observer.next(null);
          }
        });
    });
  } 

  private monitoringSmartAccountCreation(observer: Subscriber<any>, txHash: string) {
    var self = this;
    self.web3Service.getTransactionReceipt(txHash).subscribe(
      receipt => {
        if (receipt) {
          observer.next(receipt.contractAddress);
        } else {
          setTimeout(() => {
            self.monitoringSmartAccountCreation(observer, txHash);
          }, 5000);
        }
      });
  }

  public removeSmartAccount(contractAddress: string) {
    let accountData = this.localStorageService.getAccountData();
    accountData.removeSmartAccount(contractAddress);
    this.localStorageService.setAccountData(accountData);
  }

  public transferToken(smartAccountAddress: string, tokenAddress: string, to: string, amount: number, decimals: number): Observable<string> {
    return this.web3Service.transferToken(smartAccountAddress, this.getAccount(), tokenAddress, to, amount, decimals, this.getNetwork());
  }

  public sendEther(smartAccountAddress: string, to: string, amount: number): Observable<any> {
    return this.web3Service.sendEther(smartAccountAddress, this.getAccount(), to, amount, this.getNetwork());
  }

  public addExtension(smartAccountAddress: string, extensionAddress: string): Observable<any> {
    let self = this;
    return new Observable(observer => {
      let data = self.web3Service.getAddExtensionData(extensionAddress);
      self.web3Service.sendTransaction(self.getAccount(), smartAccountAddress, 0, data, 
        environment.defaultGasPrice, 200000, self.getNetwork())
        .subscribe(txHash => {
            observer.next(txHash);
        });
    });
  }

  public removeExtension(smartAccountAddress: string, extensionAddress: string): Observable<any> {
    let self = this;
    return new Observable(observer => {
        let data = self.web3Service.getRemoveExtensionData(extensionAddress);
        self.web3Service.sendTransaction(self.getAccount(), smartAccountAddress, 0, data, environment.defaultGasPrice, 200000, self.getNetwork())
          .subscribe(txHash => {
              observer.next(txHash);
          });
      });
  }

  public getTokenBalance(smartAccountAddress: string, tokenAddress: string, decimals: number): Observable<number> {
    return this.web3Service.getTokenBalance(tokenAddress, smartAccountAddress, decimals);
  }

  public getETHBalance(smartAccountAddress: string): Observable<number> {
    return this.web3Service.getETHBalance(smartAccountAddress);
  }

  public getSmartAccountVersion(smartAccountAddress: string): Observable<string> {
    let self = this;
    return new Observable(observer => {
      let data = self.web3Service.getSmartAccountVersionData();
      self.web3Service.callConstMethodWithData(data, smartAccountAddress, ["string"]).subscribe(result => {
        observer.next(result);
      });
    });
  }

  public sendGenericTransaction(to: string, value: number, gasLimit: number, data: string): Observable<string> {
    let self = this;
    return new Observable(observer => {
      self.web3Service.sendTransaction(self.getAccount(), to, value, data, environment.defaultGasPrice, gasLimit, self.getNetwork())
        .subscribe(txHash => {
            observer.next(txHash);
        });
    });
  }

  public getExtensions(smartAccountAddress: string): Observable<ExtensionStorage[]> {
    let self = this;
    return new Observable(observer => {
        let dataCount = self.web3Service.getExtensionsCountData();
        self.web3Service.callConstMethodWithData(dataCount, smartAccountAddress, ["uint256"]).subscribe(result => {
          if (result[0] == 0) observer.next([]);
          var array = [];
          for (var i = 0; i < result[0]; ++i) {
            let dataIndex = self.web3Service.getExtensionByIndexData(i);
            array.push(self.web3Service.callConstMethodWithData(dataIndex, smartAccountAddress, ["address","uint256","bytes32[]"]));
          }
          Observable.combineLatest(array)
            .subscribe(function handleValues(values) {
              var array2 = [];
              values.forEach(item => {
                let ext = new ExtensionStorage(item[0], item[1]);
                array2.push(self.getExtensionIdentifiers(smartAccountAddress, ext));
              });
              if (array2.length == 0) observer.next([]);
              Observable.combineLatest(array2)
                .subscribe(function handleValues(values2) {
                  var ret = [];
                  values2.forEach(d => {
                    if (d) ret.push(d);
                  });
                  observer.next(ret);
                });
            });
          }
        );
    });
  }

  private getExtensionIdentifiers(smartAccountAddress: string, extension: ExtensionStorage): Observable<ExtensionStorage> {
    let self = this;
    return new Observable(observer => {
      self.web3Service.callConstMethodWithAbi(extension.address, environment.extensionBaseAbi, "getIdentifiersCount", ["uint256"], smartAccountAddress).subscribe(
        result => {
          if (result[0] == 0) observer.next(extension);
          var array = [];
          for (var i = 0; i < result[0]; ++i) {
            array.push(self.web3Service.callConstMethodWithAbi(extension.address, environment.extensionBaseAbi, "getIdentifierByIndex", ["bytes32"], smartAccountAddress, i + ""));
          }
          Observable.combineLatest(array)
            .subscribe(function handleValues(values) {
              values.forEach(item => {
                extension.addIdentifier(undefined, item);
              });
              observer.next(extension);
            });
      });
    });
  }
}
