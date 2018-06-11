import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { ExtensionUI } from "../model/ExtensionUI";
import { ActionUI } from "../model/ActionUI";

@Injectable()
export class ExtensionService {

  contractInstance: any;
  extensionName: any;
  extensionDescription: any;

  constructor(private web3Service: Web3Service, private localStorageService : LocalStorageService) { }

  public getExtension(extensionAddress: string): Observable<ExtensionUI> {
    var self = this;

    return new Observable(observer => {
      let extensionUi = new ExtensionUI();
      combineLatest(self.callExtensionMethodWithSingleReturn(extensionAddress, "getName", "string"),
      self.callExtensionMethodWithSingleReturn(extensionAddress, "getDescription", "string"),
      self.callExtensionMethodWithSingleReturn(extensionAddress, "getActionsCount", "uint256"),
      self.callExtensionMethodWithSingleReturn(extensionAddress, "getViewDatasCount", "uint256"),
      self.callExtensionMethodWithSingleReturn(extensionAddress, "getSetupParametersCount", "uint256"))
      .subscribe(function handleValues(values) {
        extensionUi.address = extensionAddress;
        extensionUi.name = values[0];
        extensionUi.description = values[1];
        extensionUi.actionsCount = values[2];
        extensionUi.viewDatasCount = values[3];
        extensionUi.setupParametersCount = values[4];
        combineLatest(self.getActions(extensionAddress, extensionUi.actionsCount),
        self.getActions(extensionAddress, extensionUi.actionsCount)).subscribe(function handleValues(values) {
          var test = values;
        });

      });
      observer.next(extensionUi);
    });
          /*Observable.combineLatest(this.web3Service.callConstMethod(contractInstance, "getName"),
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
    });*/
  }

  public callExtensionMethodWithSingleReturn(extensionAddress: string, methodName: string, returnType: string): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.web3Service.callConstMethodWithAbi(extensionAddress, environment.extensionBaseAbi, methodName, [returnType]).subscribe(r => {
        observer.next(r);
      });
    });
  }

  public getActions(extensionAddress: string, actionsCount: number): Observable<any[]> {
    var self = this;
    return new Observable(observer => {
      var array = [];
      for (var i = 0; i < actionsCount; ++i) {
        self.web3Service.callConstMethodWithAbi(extensionAddress, environment.extensionBaseAbi, "getActionByIndex", ["bytes4", "string"], i + "").subscribe(r => {
          let action = new ActionUI(r[0], r[1]);
          array.push(action);
        });
      }
      observer.next(array);
  });
}
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

  //getExtension moved

  public getActionParameters(index: number, action: ExtensionAction, extension: Extension): Observable<boolean> {
    var self = this;
    return new Observable(observer => {
      this.web3Service.callConstMethodWithAbi(extension.address, environment.extensionBaseAbi, "actionParametersCountByIndex", ["uint256"], index + "").subscribe(
        result => {
          if (result[0] == 0) observer.next(true);
          var array = [];
          for (var i = 0; i < result[0]; ++i) {
            array.push(this.web3Service.callConstMethodWithAbi(extension.address, environment.extensionBaseAbi, "getActionParameterByIndexes", ["string", "uint256", "bool"], index + "", i + ""));
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
