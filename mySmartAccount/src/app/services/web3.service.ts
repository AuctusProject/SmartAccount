import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'angular-event-service';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs';
import * as SolidityCoder from 'web3/lib/solidity/coder';
import { environment } from '../../environments/environment';
import * as utils from 'web3-utils';

declare let window: any;
declare let Web3: any;

@Injectable()
export class Web3Service {

  private internalWeb3: any;

  constructor(private router: Router, private eventsService: EventsService) {
  }

  private getWeb3(): Observable<any> {
    let self = this;
    return new Observable(observer => {
      if (self.internalWeb3) {
        observer.next(self.internalWeb3);
      } else {
        window.addEventListener('load', function () {
          if (typeof window.web3 !== 'undefined') {
            self.internalWeb3 = new Web3(window.web3.currentProvider);
            observer.next(self.internalWeb3);
          }
          else {
            observer.next(null);
          }
        })
      }
    });
  }

  public hasWeb3(): Observable<boolean> {
    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        observer.next(!!web3); 
      });
    });
  }

  public toHex(val: string): string {
    return utils.toHex(val);
  }

  public toWei(value: string, decimals?: number) {
    return utils.toWei(value, this.getUnit(decimals));
  }

  public fromWei(value: string, decimals?: number) {
    return utils.fromWei(value, this.getUnit(decimals));
  }

  public getSetupData(address: string, identifier: string): string {
    return "0x519a1a41" + SolidityCoder.encodeParams(["address", "bytes32"], [address, identifier]);
  }

  public getTransferTokenData(to: string, amount: number): string {
    return "0xa9059cbb" + SolidityCoder.encodeParams(["address", "uint256"], [to, amount]);
  }

  public getTokenBalanceData(address: string): string {
    return "0x70a08231" + SolidityCoder.encodeParams(["address"], [address]);
  }

  public getExecuteCallData(destination: string, value: number, gasLimit: number, data: string): string {
    return "0xd97cf075" + SolidityCoder.encodeParams(["address", "uint256", "uint256", "bytes"], [destination, value, gasLimit, data]);
  }

  public getAddExtensionData(address: string): string {
    return "0x3cfd78f3" + SolidityCoder.encodeParams(["address"], [address]);
  }

  public getRemoveExtensionData(address: string): string {
    return "0x61775ee1" + SolidityCoder.encodeParams(["address"], [address]);
  }

  public getExtensionsCountData(): string {
    return "0x5b7991cd";
  }

  public getExtensionByIndexData(index: number): string {
    return "0x98413ff1" + SolidityCoder.encodeParams(["uint256"], [index]);;
  }

  public getSmartAccountVersionData(): string {
    return "0x54fd4d50";
  }

  public getIsBouncerData(address: string): string {
    return "0xac4ab3fb" + SolidityCoder.encodeParams(["address", "bytes32"], [address,"0x6ac111a9c17d7cd460068909fd36118d5e2435d06df0692ae42adf660375fabe"]);
  }

  public getNetwork(): Observable<string> {
    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        web3.version.getNetwork((err, network) => {
          observer.next(network);
        });
      });
    });
  }

  public getAccount(): Observable<string> {
    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        web3.eth.getAccounts(function (err, accounts) {
          var currentAccount = accounts.length > 0 ? accounts[0] : null;
          observer.next(currentAccount);
        });
      });
    });
  }

  public callConstMethodWithAbi(to: string, abi: string, methodName: string, returnTypes: string[], ...params: string[]): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        let data = web3.eth.contract(JSON.parse(abi)).at(to)[methodName].getData.apply(null, params);
        self.callConstMethodWithData(data, to, returnTypes).subscribe(r => {
          observer.next(r);
        });
      });
    });
  }

  public callConstMethodWithData(data: string, to: string, returnTypes: string[]): Observable<any> {
    let self = this;
    return new Observable(observer => {
      var transObj = {
        to: to,
        data: data
      };
      self.getWeb3().subscribe(web3 => {
        web3.eth.call(transObj,
          function (err, result) {
            var decoded = SolidityCoder.decodeParams(returnTypes, result.substring(2));
            observer.next(self.parseReturn(returnTypes, decoded));
          });
      });
    });
  }

  private parseReturn(returnTypes: string[], decoded: any[]) {
    var returns = [];
    for (var i = 0; i < returnTypes.length; ++i) {
      let isArray = returnTypes[i].split("[").length > 1;
      if (isArray) {
        let array = [];
        for (let j = 0; j < decoded[i].length; ++j) {
          array.push(this.parseType(returnTypes[i], decoded[i][j]));
        }
        returns.push(array);
      } else {
        returns.push(this.parseType(returnTypes[i], decoded[i]));
      }
    }
    return returns;
  }

  private parseType(type: string, decoded: any): any {
    if (type.indexOf("int") >= 0) {
        return Number.parseInt(decoded.toString(10));
    } else if (type.indexOf("bool") >= 0) {
        return decoded;
    } else {
        return decoded.toString();
    }
  }

  public getETHBalance(address: string): Observable<number> {
    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        web3.eth.getBalance(address, function (error, result) {
          if (!error) {
            var ether = self.fromWei(result.toString(10));
            observer.next(parseFloat(ether));
          }
          else {
            observer.next(null);
          }
        });
      });
    });
  }

  public getTokenBalance(tokenAddress: string, accountAddress: string, decimals: number): Observable<number> {
    let data = this.getTokenBalanceData(accountAddress);
    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        self.callConstMethodWithData(data, tokenAddress, ["uint256"]).subscribe(ret => {
          var amount = self.fromWei(ret[0].toPrecision(80).split('.')[0], decimals);
          observer.next(parseFloat(amount));
        });
      });
    });
  }

  public transferToken(smartAccountAddress: string, loggedWallet: string, tokenAddress: string, to: string, amount: number, decimals: number, chainId: string): Observable<string> {
    let tokenData = this.getTransferTokenData(to, this.toWei(amount.toString(), decimals));
    let data = this.getExecuteCallData(tokenAddress, 0, 0, tokenData);
    let self = this;
    return new Observable(observer => {
      self.sendTransaction(loggedWallet, smartAccountAddress, 0, data, environment.defaultGasPrice, 150000, chainId).subscribe(ret => {
        observer.next(ret);
      });
    });
  }

  public sendEther(smartAccountAddress: string, loggedWallet: string, to: string, amount: number, chainId: string): Observable<string> {
    let data = this.getExecuteCallData(to, this.toWei(amount.toString()), 0, "");
    let self = this;
    return new Observable(observer => {
      self.sendTransaction(loggedWallet, smartAccountAddress, 0, data, environment.defaultGasPrice, 150000, chainId).subscribe(ret => {
        observer.next(ret);
      });
    });
  }

  public isMined(txHash): Observable<boolean> {
    let self = this;
    return new Observable(observer => {
      return self.isMinedTransaction(observer, txHash);
    });
  }

  private isMinedTransaction(observer: Subscriber<boolean>, txHash: string) {
    var self = this;
    self.getTransactionReceipt(txHash).subscribe(
      receipt => {
        if (receipt) {
          observer.next(true);
        } else {
          setTimeout(() => {
            self.isMinedTransaction(observer, txHash);
          }, 5000);
        }
      });
  }

  public getTransactionReceipt(hash): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        web3.eth.getTransactionReceipt(hash,
          function (err, result) {
            if (err || !result) { 
              observer.next(null);
            } else {
              observer.next(result);
            }
          });
      });
    });
  }

  private getUnit(decimals?: number): string {
    if (!decimals || decimals == 18) {
      return 'ether';
    } else if (decimals == 1) {
      return 'wei';
    } else if (decimals == 3) {
      return 'kwei';
    } else if (decimals == 6) {
      return 'mwei';
    } else if (decimals == 9) {
      return 'gwei';
    } else if (decimals == 12) {
      return 'szabo';
    } else if (decimals == 15) {
      return 'finney';
    } else if (decimals == 21) {
      return 'kether';
    } else if (decimals == 24) {
      return 'mether';
    } else if (decimals == 27) {
      return 'gether';
    } else if (decimals == 30) {
      return 'tether';
    } else {
      return undefined;
    }
  }

  public sendTransaction(from: string, to: string, value: number, data: string, 
    gasPrice: number, gasLimit: number, chainId: string): Observable<string> {

    let self = this;
    return new Observable(observer => {
      self.getWeb3().subscribe(web3 => {
        web3.eth.getTransactionCount(from, web3.eth.defaultBlock,
        function (err, result) {
          if (err) {
            observer.next(null);
          } else {
            var transactionObj = {
              nonce: web3.toHex(result),
              gasPrice: web3.toHex(gasPrice),
              gasLimit: web3.toHex(gasLimit),
              from: from,
              to: to,
              value: web3.toHex(self.toWei(value.toString())),
              data: data,
              chainId: web3.toHex(chainId)
            };
            web3.eth.sendTransaction(transactionObj,
              function (err, result) {
                if (result) {
                  observer.next(result);
                }
                else {
                  observer.next(null);
                }
              });
          }
        });
      });
    });
  }
}
