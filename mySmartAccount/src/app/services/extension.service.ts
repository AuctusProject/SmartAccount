import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ExtensionService {

  contractInstance: any;
  baseAbi: string = '[{"constant":true,"inputs":[{"name":"_reference","type":"address"}],"name":"getIdentifiersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"baseExtensionVersion","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"getDescription","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getSetupParametersByIndex","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reference","type":"address"},{"name":"_index","type":"uint256"}],"name":"getIdentifierByIndex","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reference","type":"address"}],"name":"getIdentifiers","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"actionIndex","type":"uint256"},{"name":"parameterIndex","type":"uint256"}],"name":"getActionParameterByIndexes","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getViewDataByIndex","outputs":[{"name":"","type":"bytes4"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewDatasCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"actionsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSetupFunction","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getActionByIndex","outputs":[{"name":"","type":"bytes4"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"actionParametersCountByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"setupParametersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]';

  constructor(private web3Service: Web3Service, private localStorageService : LocalStorageService) { }
/*
  public getExtensionList() : Extension[]{
    var extensionList = this.localStorageService.getLocalStorage("extension_list");
    if (extensionList) {
      return JSON.parse(extensionList);
    }
    else {
      return [
        new Extension("0xACf9CA0765A688dd358543080B684cCf50E82926", "Fund Recovery"),
        new Extension("0x05D1D91B68C20032c09265FC14a5c9e1Ddf08341", "Recurrent Payment")
      ]
    }
  }

  public getExtensionByAddress(address) : Extension{
    var extensionList = this.getExtensionList();
    var ret : Extension;
    extensionList.forEach(extension => {
      if (extension.address == address) {
        ret = extension;
      }
    });
    return ret;
  }

  public getExtensionIndexByAddress(address) : number{
    var extensionList = this.getExtensionList();
    var ret : number = -1;
    for (var i = 0; i < extensionList.length; ++i){
      if (extensionList[i].address == address) {
        ret = i;
      }
    }
    return ret;
  }

  public updateExtension(extension : Extension){
    var index = this.getExtensionIndexByAddress(extension.address);
    if (index > -1){
      var extensionList = this.getExtensionList();
      extensionList[index] = extension;
      this.localStorageService.setLocalStorage("extension_list", extensionList);
    }
  }

  public getSetupData(smartAddress: string, extensionAddress: string, returnTypes: string[]): Observable<any[]> {
    var self = this;

    return new Observable(observer => {
      this.web3Service.getWeb3().subscribe(web3 => {

        this.web3Service.callConstMethodWithAbi(extensionAddress, self.baseAbi, "getIdentifiersCount", ["uint256"], smartAddress).subscribe(
          result => {
            if (result[0] == 0) observer.next([]);
            var array = [];
            for (var i = 0; i < result[0]; ++i) {
              array.push(this.web3Service.callConstMethodWithAbi(extensionAddress, self.baseAbi, "getIdentifierByIndex", ["bytes32"], i + ""));
            }
  
            Observable.combineLatest(array)
              .subscribe(function handleValues(values) {
                var array2 = [];
                values.forEach(identifier => {
                  array2.push(this.web3Service.getValueSetupData(smartAddress, extensionAddress, identifier, returnTypes));
                });
                Observable.combineLatest(array2)
                .subscribe(function handleValues(values2) {
                  var ret = [];
                  values2.forEach(d => {
                    ret.push(d);
                  });
                  observer.next(ret);
                });
              });
          }
        );
      });
    });
  }

  public getValueSetupData(smartAddress: string, extensionAddress: string, identifier: string, returnTypes: string[]) : Observable<any[]> {
    var data = this.web3Service.getSetupData(smartAddress, identifier);
    return new Observable(observer => {
      this.web3Service.callConstMethodWithData(data, extensionAddress, returnTypes).subscribe(ret => {
        observer.next(ret);
      });
    });
  }

  public getExtension(extensionAddress: string): Observable<Extension> {
    var self = this;

    return new Observable(observer => {
      this.web3Service.getContract(this.baseAbi, extensionAddress).subscribe(
        contractInstance => {
          self.contractInstance = contractInstance;
          Observable.combineLatest(this.web3Service.callConstMethod(contractInstance, "getName"),
            this.web3Service.callConstMethod(contractInstance, "getDescription"))
            .subscribe(function handleValues(values) {
              var extension = new Extension(extensionAddress, values[0], values[1]);
              self.getSetupParameters(extension).subscribe(setup => {
                self.getViewDatas(extension).subscribe(viewDatas => {
                  self.getActions(extension).subscribe(actions => {
                    var array = [];
                    for (var i = 0; i < actions.length; ++i) {
                      array.push(self.getActionParameters(i, actions[i], extension));
                    }
                    Observable.combineLatest(array)
                      .subscribe(function handleValues(values) {
                        observer.next(extension);
                      });
                  });
                })
              });
            });
        });
    });
  };

  public getActionParameters(index: number, action: ExtensionAction, extension: Extension): Observable<boolean> {
    var self = this;
    return new Observable(observer => {
      this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "actionParametersCountByIndex", ["uint256"], index + "").subscribe(
        result => {
          if (result[0] == 0) observer.next(true);
          var array = [];
          for (var i = 0; i < result[0]; ++i) {
            array.push(this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "getActionParameterByIndexes", ["string", "uint256", "bool"], index + "", i + ""));
          }

          Observable.combineLatest(array)
            .subscribe(function handleValues(values) {
              values.forEach(actionParameterArray => {
                action.addActionParameter(new ExtensionActionParameter(actionParameterArray[0], actionParameterArray[1], actionParameterArray[2]));
              });
              observer.next(true);
            });
        }
      );
    });
  }

  public getActions(extension: Extension): Observable<any[]> {
    var self = this;
    return new Observable(observer => {
      this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "actionsCount", ["uint256"]).subscribe(
        result => {
          var array = [];
          for (var i = 0; i < result[0]; ++i) {
            array.push(this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "getActionByIndex", ["bytes4", "string"], i + ""));
          }

          Observable.combineLatest(array)
            .subscribe(function handleValues(values) {
              var actionArray = [];
              values.forEach(action => {
                var extAction = new ExtensionAction(action[0], action[1]);
                actionArray.push(extAction);
                extension.addAction(extAction);
              });
              observer.next(actionArray);
            });
        });
    });
  }

  public getViewDatas(extension: Extension): Observable<boolean> {
    var self = this;
    return new Observable(observer => {
      this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "viewDatasCount", ["uint256"]).subscribe(
        result => {
          var array = [];
          for (var i = 0; i < result[0]; ++i) {
            array.push(this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "getViewDataByIndex", ["bytes4", "string", "uint256", "bool"], i + ""));
          }

          Observable.combineLatest(array)
            .subscribe(function handleValues(values) {
              values.forEach(viewData => {
                extension.addViewDataParameter(new ExtensionViewDataParameters(viewData[0], viewData[1], viewData[2], viewData[3]));
              });
              observer.next(true);
            });
        }
      );
    });
  }

  public getSetupParameters(extension: Extension): Observable<boolean> {
    var self = this;
    return new Observable(observer => {
      this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "setupParametersCount", ["uint256"]).subscribe(
        result => {
          var array = [];
          for (var i = 0; i < result[0]; ++i) {
            array.push(this.web3Service.callConstMethodWithAbi(extension.address, this.baseAbi, "getSetupParametersByIndex", ["bool", "string", "uint256", "bool"], i + ""));
          }

          Observable.combineLatest(array)
            .subscribe(function handleValues(values) {
              values.forEach(setup => {
                extension.addSetupParameter(new ExtensionSetupParameters(setup[0], setup[1], setup[2], setup[3]));
              });
              observer.next(true);
            });
        }
      );
    });
  }*/
}
