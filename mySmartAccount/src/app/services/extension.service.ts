import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { ExtensionUI } from "../model/ExtensionUI";
import { ActionUI } from "../model/ActionUI";
import { ParameterUI } from "../model/ParameterUI";
import { ViewDataUI } from "../model/ViewDataUI";

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
        self.getViewDataParams(extensionAddress, extensionUi.viewDatasCount),
        self.getSetupParameters(extensionAddress, extensionUi.setupParametersCount)).subscribe(function handleValues(values) {
          extensionUi.actions = values[0];
          extensionUi.viewDataParameters = values[1];
          extensionUi.setupParameters = values[2];
          observer.next(extensionUi);
        });
      });
    });
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
      var paramCountArray = [];
      for (var i = 0; i < actionsCount; ++i) {
        array.push(self.web3Service.callConstMethodWithAbi(extensionAddress, environment.extensionBaseAbi, "getActionByIndex", ["bytes4", "string"], i + ""));
        paramCountArray.push(self.web3Service.callConstMethodWithAbi(extensionAddress, environment.extensionBaseAbi, "getActionParametersCountByIndex", ["uint256"], i + ""));
      }
      Observable.combineLatest(array).subscribe(function handleValues(actions) {
        var actionArray = [];
        actions.forEach(param => {
          let action = new ActionUI(param[0], param[1]);
          actionArray.push(action);
        });
        Observable.combineLatest(paramCountArray).subscribe(function handleValues(paramCounts) {
          var parameterArray = [];
          let actionCount = 0;
          paramCounts.forEach(param => {
            for (var i = 0; i < param; ++i) {
              parameterArray.push(self.web3Service.callConstMethodWithAbi(extensionAddress, environment.extensionBaseAbi, "getActionParameterByIndexes", ["bool", "uint256", "uint256", "string"], actionCount + "", i + ""));
            }
            actionCount++;
          });
          Observable.combineLatest(parameterArray).subscribe(function handleValues(parameters) {
            let actionCount = 0;
            let actionParamCount = 1;
            let globalCount = 0;

            while (globalCount < parameters.length) {
              if (actionParamCount <= paramCounts[actionCount]) {
                actionArray[actionCount].args.push(new ParameterUI(parameters[globalCount][3], parameters[globalCount][1], parameters[globalCount][2], parameters[globalCount][0], true));
                actionParamCount++;
                globalCount++;
              } else {
                actionParamCount = 1;
                actionCount++;
              }
            }
            observer.next(actionArray);
          });
        });
      });
    });
  }
  
  public getViewDataParams(extensionAddress: string, viewDataCount: number): Observable<any[]> {
    var self = this;
    return new Observable(observer => {
      var array = [];
      for (var i = 0; i < viewDataCount; ++i) {
        array.push(self.web3Service.callConstMethodWithAbi(extensionAddress, environment.extensionBaseAbi, "getActionByIndex", ["bytes4", "bool", "uint256", "uint256", "string"], i + ""));
      }
      Observable.combineLatest(array).subscribe(function handleValues(values) {
        var viewDataArray = [];
        values.forEach(param => {
          let output = new ParameterUI(param[4], param[2], param[3], param[1], false);
          let viewData = new ViewDataUI(param[0], output);
          viewDataArray.push(viewData);
        });
        observer.next(viewDataArray);
      });
    });
  }
  
  public getSetupParameters(extensionAddress: string, setupParametersCount: number): Observable<any[]> {
    var self = this;
    return new Observable(observer => {
      var array = [];
      for (var i = 0; i < setupParametersCount; ++i) {
        array.push(self.web3Service.callConstMethodWithAbi(extensionAddress, environment.extensionBaseAbi, "getSetupParametersByIndex", ["bool", "bool", "uint256", "uint256", "string"], i + ""));
      }
      Observable.combineLatest(array).subscribe(function handleValues(values) {
        var setupArray = [];
        values.forEach(param => {
          let setupParam = new ParameterUI(param[4], param[2], param[3], param[1], param[0]);
          setupArray.push(setupParam);
        });
        observer.next(setupArray);
      });
    });
  }
}
