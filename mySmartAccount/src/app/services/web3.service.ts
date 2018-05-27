import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'angular-event-service';
import { Observable } from 'rxjs/Observable';

declare let window: any;
declare let Web3: any;

@Injectable()
export class Web3Service {

  private web3: any;

  constructor(private router: Router, private eventsService: EventsService) {
  }

  public getWeb3(): Observable<any> {
    let self = this;
    return new Observable(observer => {
      if (self.web3) {
        observer.next(self.web3);
      }
      else {
        window.addEventListener('load', function () {
          if (typeof window.web3 !== 'undefined') {
            self.web3 = new Web3(window.web3.currentProvider);
            observer.next(self.web3);
          }
          else {
            observer.next(null);
          }
        })
      }
    });
  }

  public getNetwork(): Observable<number> {
    let self = this;
    return new Observable(observer => {
      self.web3.version.getNetwork((err, network) => {
        observer.next(network);
      });
    })
  }

  public getAccount(): Observable<string> {
    let self = this;
    return new Observable(observer => {
      if (!self.web3) {
        observer.next(null);
      }
      else {
        self.web3.eth.getAccounts(function (err, accounts) {
          var currentAccount = accounts.length > 0 ? accounts[0] : null;
          observer.next(currentAccount);
        });
      }
    });
  }

  public toHex(val: string): string {
    return this.web3.toHex(val);
  }

  public toWei(value: string, unit?: string) {
    return this.web3.toWei(value, unit);
  }

  public callConstMethod(contractInstance: any, methodName: string, ...params: string[]): Observable<any> {
    return new Observable(observer => {
      contractInstance[methodName].call(params, {}, this.web3.eth.defaultBlock,
        function (err, result) {
          observer.next(result);
        })
    })
  }

  public getContractMethodData(contractInstance : any, method: string, ...params: any[]) {
    var data = contractInstance[method].getData.apply(null, params);
    return data;
  }

  public getContract(abi: string, contractAddress: string): Observable<any> {
    return new Observable(observer => {
      this.getWeb3().subscribe(web3 => {
        observer.next(web3.eth.contract(JSON.parse(abi)).at(contractAddress));
      });
    });
  }

  public getETHBalance(address): Observable<number> {
    var self = this;
    return new Observable(observer => {
      if (!self.web3) {
        observer.next(0);
      }
      else {
        self.web3.eth.getBalance(address, function (error, result) {
          if (!error) {
            var ether = self.web3.fromWei(result, 'ether');
            observer.next(parseFloat(ether));
          }
          else {
            observer.next(0);
          }
        });
      }
    })
  }

  public getTokenBalance(tknContractAddress: string, accountAddrs: string, cb, symbol: string, caller) {
    let localWeb3 = this.web3;
    this.web3.eth.call({
      to: tknContractAddress, // Contract address, used call the token balance of the address in question
      data: '0x70a08231000000000000000000000000' + (accountAddrs).substring(2) // Combination of contractData and tknAddress, required to call the balance of an address 
    }, this.web3.eth.defaultBlock, function (err, result) {
      if (result) {
        //var tokens = this.web3.toBN(result).toString(); // Convert the result to a usable number string
        var tokensEther = localWeb3.fromWei(result, 'ether'); //this.web3.fromWei(tokens, 'ether');
        cb(err, parseFloat(tokensEther), symbol, tknContractAddress, caller);
      }
      else {
        cb(err);
      }
    });
  }

  public sendToken(tknContractAddress: string, to: string, amount: number, cb, caller) {
    let localWeb3 = this.web3;
    this.web3.eth.call({
      to: tknContractAddress, // Contract address, used call the token balance of the address in question
      data: '0xa9059cbb000000000000000000000000' 
          + (to).substring(2)
          + amount.toString(16).padStart(64,'0') // Combination of contractData and tknAddress, required to call the balance of an address 
    }, this.web3.eth.defaultBlock, function (err, result) {
      if (result) {
        //var tokens = this.web3.toBN(result).toString(); // Convert the result to a usable number string

        cb(err, to, amount, caller);
      }
      else {
        cb(err);
      }
    });
  }

  private getTransaction(hash, cb) {
    this.web3.eth.getTransaction(hash, cb);
  }

  public getTransactionReceipt(hash): Observable<any> {
    var self = this;
    return new Observable(observer => {
      this.web3.eth.getTransactionReceipt(hash,
        function (err, result) {
          if (!err && !result) { //not mined yet
            observer.next(null);
          }
          else
            observer.next(result);
        });
    });
  }

  public sendTransaction(gasPrice: number, gasLimit: number, from: string, to: string,
    value: number, data: string, chainId: string): Observable<any> {

    const gasPriceWei = this.web3.toWei(gasPrice.toString(), "ether");
    const valueWei = this.web3.toWei(value.toString(), 'ether');

    let self = this;
    return new Observable(observer => {

      this.web3.eth.getTransactionCount(from, this.web3.eth.defaultBlock,
        function (err, result) {
          if (err) observer.next(null);
          else {
            var transactionObj = {
              nonce: self.web3.toHex(result),
              gasPrice: self.web3.toHex(gasPrice),
              gasLimit: self.web3.toHex(gasLimit),
              from: from,
              to: to,
              value: self.web3.toHex(valueWei),
              data: data,
              chainId: self.web3.toHex(chainId)
            };

            self.web3.eth.sendTransaction(transactionObj,
              function (err, result) {
                if (result) {
                  observer.next(result);
                }
                else {
                  observer.next(null);
                }
              });
          }
        })
    });
  }

}
