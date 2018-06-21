import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from '../../services/local-storage.service';
import { Web3Service } from '../../services/web3.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionUI } from '../../model/ExtensionUI';
import { GeneralUtil } from '../../util/generalUtil';
import { ActionUI } from '../../model/ActionUI';
import * as SolidityCoder from 'web3/lib/solidity/coder';
import { Observable } from 'rxjs/Observable';
import { ParameterUI } from '../../model/ParameterUI';
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

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
  showData: boolean;
  showSetup: boolean;
  ownerActions: ActionUI[];
  externalActions: ActionUI[];
  
  constructor(private route: ActivatedRoute, 
    private zone: NgZone, 
    private router: Router,
    private ref: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private smartAccountService: SmartAccountService,
    private web3Service: Web3Service,
    public dialog: MatDialog) {}

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
                    self.externalActions = new Array<ActionUI>();
                    self.ownerActions = new Array<ActionUI>();
                    for (let i = 0; i < self.ui.actions.length; ++i) {
                        if (self.ui.actions[i].directlyCallFunction) {
                            self.externalActions.push(self.ui.actions[i]);
                        } else {
                            self.ownerActions.push(self.ui.actions[i]);
                        }
                    }
                    self.roles = GeneralUtil.getRolesNames(self.ui.rolesIds);
                    self.setDataValues();
                    self.setSetupValues();
                    let addedExtensions = accountData.getSmartAccount(self.smartAccountAddress).extensions;
                    for (let i = 0; i < addedExtensions.length; ++i) {
                        if (addedExtensions[i].address == self.extensionAddress) {
                            for (let j = 0; j < addedExtensions[i].identifiers.length; ++j) {
                                if (addedExtensions[i].identifiers[j].identifier == self.extensionInstanceIdentifier) {
                                    self.name = addedExtensions[i].identifiers[j].name;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (!self.name) {
                        self.name = 'Not defined';
                    }
                }
            }
        });
    }

    setDataValues() {
        let suffixData = SolidityCoder.encodeParams(["address", "bytes32"], [this.smartAccountAddress, this.extensionInstanceIdentifier]);
        let array = [];
        for (let i = 0; i < this.ui.viewDataParameters.length; ++i) {
            array.push(this.web3Service.callConstMethodWithData(this.ui.viewDataParameters[i].funcSignature + suffixData, 
                this.extensionAddress, [GeneralUtil.getWeb3Type(this.ui.viewDataParameters[i].output)]));
        }
        let self = this;
        Observable.combineLatest(array).subscribe(function handleValues(values) {
            self.dataValues = new Array<any>();
            values.forEach(val => {
                self.dataValues.push(val[0]);
            });
            self.showData = true;
        });
    }

    setSetupValues() {
        let data = this.web3Service.getSetupData(this.smartAccountAddress, this.extensionInstanceIdentifier);
        let self = this;
        this.web3Service.callConstMethodWithData(data, this.extensionAddress, this.ui.getSetupWeb3Types()).subscribe(ret => {
            self.setupValues = new Array<any>();
            for (let i = 0; i < self.ui.setupParameters.length; ++i) {
                let value = null;
                if (self.ui.setupParameters[i].type == 1 || self.ui.setupParameters[i].type == 2) {
                    value = ret[i] / (self.ui.setupParameters[i].decimals > 1 ? self.ui.setupParameters[i].decimals : 1);
                } else if (self.ui.setupParameters[i].type == 5) {
                    value = new Date(ret[i]);
                } else {
                    value = ret[i];
                }
                self.setupValues.push(value);
            }
            self.showSetup = true;
        });
    }

    getBackDestination() {
        return ['account', this.smartAccountAddress]; 
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

    getActionDirectlyCall() {
        return this.actionSelected.directlyCallFunction;
    }

    getActionParameters() {
        return this.actionSelected.args;
    }

    getActionSubtitle() {
        return this.actionSelected.description;
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
        this.ref.detectChanges();
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
        } else {
            this.dialog.open(ConfirmationDialogComponent, {
                data: { customTitle: "Invalid Input", hideConfirmation: true, text: "The data entered is invalid." }
              });
        }
    }
}