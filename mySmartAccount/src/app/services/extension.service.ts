import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Extension } from '../model/Extension';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ExtensionService {

  contractInstance: any;

  constructor(private web3Service: Web3Service) { }

  public getExtension(extensionAddress: string): Observable<Extension> {
    var self = this;
    var abi = '[{"constant":true,"inputs":[{"name":"_reference","type":"address"}],"name":"getIdentifiersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"baseExtensionVersion","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"getDescription","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getSetupParametersByIndex","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reference","type":"address"},{"name":"_index","type":"uint256"}],"name":"getIdentifierByIndex","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reference","type":"address"}],"name":"getIdentifiers","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"actionIndex","type":"uint256"},{"name":"parameterIndex","type":"uint256"}],"name":"getActionParameterByIndexes","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getViewDataByIndex","outputs":[{"name":"","type":"bytes4"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewDatasCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"actionsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSetupFunction","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getActionByIndex","outputs":[{"name":"","type":"bytes4"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"actionParametersCountByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"setupParametersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]';
    return new Observable(observer => {
      this.web3Service.getContract(abi, extensionAddress).subscribe(
        contractInstance => {
          self.contractInstance = contractInstance;
          Observable.combineLatest(this.web3Service.callConstMethod(contractInstance, "getName"),
            this.web3Service.callConstMethod(contractInstance, "getDescription"))
            .subscribe(function handleValues(values) {
              observer.next(new Extension(extensionAddress, values[0], values[1]));
            });
        });
    });
  };

  public getActionsCount(extension: Extension) {
    this.web3Service.callConstMethod(this.contractInstance, "actionsCount").subscribe(
      result => {
        extension.actionsCount = result;
      })
  }

  public getViewDatasCount(extension: Extension) {
    this.web3Service.callConstMethod(this.contractInstance, "viewDatasCount").subscribe(
      result => {
        extension.viewDatasCount = result;
      })
  }

  public getSetupParametersCount(extension: Extension) {
    this.web3Service.callConstMethod(this.contractInstance, "setupParametersCount").subscribe(
      result => {
        extension.setupParametersCount = result;
      })
  }
}
