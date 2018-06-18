import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { Web3Service } from '../../services/web3.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionUI } from '../../model/ExtensionUI';
import { GeneralUtil } from '../../util/generalUtil';
import { ActionUI } from '../../model/ActionUI';
import * as SolidityCoder from 'web3/lib/solidity/coder';
import { Observable } from 'rxjs/Observable';
import { ParameterUI } from '../../model/ParameterUI';

@Component({
    selector: 'app-extension-instance-details',
    templateUrl: './extension-instance-details.component.html',
    styleUrls: ['./extension-instance-details.component.css']
})
export class ExtensionInstanceDetailsComponent implements OnInit {
  smartAccountAddress: string;
  extensionAddress: string;
  extensionInstanceIdentifier: string;
  ui: ExtensionUI;
  name: string;
  nameEditing: any;
  editing: boolean;
  roles: string[];
  showActionDetails: boolean;
  setupValues: any[];
  dataValues: any[];
  actionSelected: ActionUI;
  
  constructor(private route: ActivatedRoute, 
    private zone: NgZone, 
    private router: Router,
    private localStorageService: LocalStorageService,
    private smartAccountService: SmartAccountService,
    private web3Service: Web3Service) {}

    ngOnInit(): void {
        let self = this;
        this.route.params.subscribe(params => {
            self.smartAccountAddress = params["smartaccountaddress"];
            self.extensionAddress = params["extensionaddress"];
            self.extensionInstanceIdentifier = params["extensionidentifier"];
            if (!self.smartAccountAddress || !self.extensionAddress || !self.extensionInstanceIdentifier) {
                self.zone.run(() => self.router.navigate(['home']));
            } else {
                let accountData = self.localStorageService.getAccountData();
                self.ui = accountData.getExtensionUI(self.extensionAddress);
                if (!self.ui) {
                    self.zone.run(() => self.router.navigate(['account', self.smartAccountAddress]));
                } else {
                    self.roles = GeneralUtil.getRolesNames(self.ui.rolesIds);
                    self.setDataValues();
                    self.setSetupValues();
                    let addedExtensions = accountData.getSmartAccount(self.smartAccountAddress).extensions;
                    addedExtensions.forEach(ext => {
                        if (ext.address == self.extensionAddress) {
                            ext.identifiers.forEach(iden => {
                                if (iden.identifier == self.extensionInstanceIdentifier) {
                                    self.name = iden.name;
                                    return;
                                }
                            });
                        }
                    });
                    self.name = 'Not defined';
                }
            }
        });
    }

    setDataValues() {
        let suffixData = SolidityCoder.encodeParams(["address", "bytes32"], [this.smartAccountAddress, this.extensionInstanceIdentifier]);
        let array = [];
        let self = this;
        this.ui.viewDataParameters.forEach(view => {
            array.push(self.web3Service.callConstMethodWithData(view.funcSignature + suffixData, self.extensionAddress, [GeneralUtil.getWeb3Type(view.output)]));
        });
        Observable.combineLatest(array).subscribe(function handleValues(values) {
            self.dataValues = values;
        });
    }

    setSetupValues() {
        let data = this.web3Service.getSetupData(this.smartAccountAddress, this.extensionInstanceIdentifier);
        let self = this;
        this.web3Service.callConstMethodWithData(data, this.extensionAddress, this.ui.getSetupWeb3Types()).subscribe(ret => {
            self.setupValues = ret;
        });
    }

    getBackDestination() {
        this.zone.run(() => this.router.navigate(['account', this.smartAccountAddress])); 
    }

    getDataTitle() {
        return "INSTANCE DATA";
    }

    getDataParameters() {
        let array = [];
        this.ui.viewDataParameters.forEach(view => {
            array.push(view.output);
        });
        return array;
    }

    getSetupTitle() {
        return "CONFIGURATIONS";
    }

    getSetupActionName() {
        return "SAVE";
    }

    setupExecuted() {
        this.setSetupValues();
    }

    getActionTitle() {
        return "ACTIONS";
    }

    getButtonActionName() {
        return "EXECUTE";
    }

    getBackActionName() {
        return "CANCEL";
    }

    clickAction(funcSignature: string) {
        let self = this;
        this.ui.actions.forEach(act => {
            if (act.funcSignature == funcSignature) {
                self.actionSelected = act;
                self.showActionDetails = true;
                return;
            }
        });
    }

    getActionSignature() {
        return this.actionSelected.funcSignature;
    }

    getActionParameters() {
        return this.actionSelected.args;
    }

    getActionValues() {
        let values = [];
        this.actionSelected.args.forEach(element => {
            values.push(null);
        });
        return values;
    }

    actionBack() {
        this.showActionDetails = false;
    }

    actionExecuted() {
        this.showActionDetails = false;
        this.setDataValues();
    }

    setEditName() {
        this.editing = true;
        this.nameEditing = null;
      }
    
    back() {
        this.editing = false;
    }

    getIndex(): number {
        return 0;
    }

    getNameParameter(): ParameterUI {
        return new ParameterUI("Name", 6, 0, false, true, false);
    }

    setName(name: any) {
        this.nameEditing = name;
    }

    saveName() {
        if (this.nameEditing && this.nameEditing.status) {
            this.name = this.nameEditing.value;
            let self = this;
            let account = this.localStorageService.getAccountData();
            let smartAccount = account.getSmartAccount(this.smartAccountAddress);
            smartAccount.extensions.forEach(ext => {
                if (ext.address == self.extensionAddress) {
                    ext.identifiers.forEach(iden => {
                        if (iden.identifier == self.extensionInstanceIdentifier) {
                            iden.name = self.name;
                        }
                    });
                }
            });
            account.updateSmartAccount(smartAccount);
            this.localStorageService.setAccountData(account);
            this.back();
        }
    }
}