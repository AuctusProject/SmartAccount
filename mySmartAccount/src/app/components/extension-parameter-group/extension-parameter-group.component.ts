import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SmartAccountService } from '../../services/smart-account.service';
import { ParameterUI } from '../../model/ParameterUI';
import { Web3Service } from '../../services/web3.service';
import * as SolidityCoder from 'web3/lib/solidity/coder';
import { GeneralUtil } from '../../util/generalUtil';


@Component({
  selector: 'app-extension-parameter-group',
  templateUrl: './extension-parameter-group.component.html',
  styleUrls: ['./extension-parameter-group.component.css']
})
export class ExtensionParameterGroupComponent implements OnInit {

    @Input() title: string;
    @Input() subtitle: string;
    @Input() actionButtonName: string;
    @Input() backButtonName: string;
    @Input() functionSignature: string;
    @Input() smartAccountAddress: string;
    @Input() extensionAddress: string;
    @Input() identifier: string;
    @Input() disabled: boolean;
    @Input() expanded: boolean;
    @Input() parameters: ParameterUI[];
    @Input() initialValues: any[];
    @Input() forceAllEditable: boolean;
    @Input() forceIdentifierFirst: boolean;
    @Input() directlyCallFunction: boolean;
    @Output() backClick = new EventEmitter();
    @Output() executed = new EventEmitter();
    executing: boolean;
    values = new Array<any>();

    constructor(private route: ActivatedRoute, 
        private zone: NgZone, 
        private router: Router,
        private smartAccountService: SmartAccountService,
        private web3Service: Web3Service) { }
    
    ngOnInit() {
        this.executing = false;
    }

    execute() {
        if (this.isValidParameters()) {
            let types = [];
            let values = [];
            if (this.forceIdentifierFirst) {
                types.push("bytes32");
                values.push(this.identifier);
            }
            for (let i = 0; i < this.values.length; ++ i) {
                types.push(GeneralUtil.getWeb3Type(this.parameters[i]));
                values.push(this.values[i].value)
            }
            let baseData = this.functionSignature + SolidityCoder.encodeParams(types, values);
            let data;
            let to;
            if (this.directlyCallFunction) {
                data = baseData;
                to = this.extensionAddress;
            } else {
                data = this.web3Service.getExecuteCallData(this.extensionAddress, 0, 0, baseData);
                to = this.smartAccountAddress;
            }
            this.executing = true;
            let self = this;
            this.smartAccountService.sendGenericTransaction(to, 0, 0, data).subscribe(txHash => {
                self.web3Service.isMined(txHash).subscribe(ret => {
                    this.executing = false;
                    self.executed.emit();
                });
            });
        }
    }

    back() {
        this.backClick.emit();
    }

    parameterSet(value: any) {
        for (let i = 0; i < this.values.length; ++ i) {
            if (this.values[i].index == value.index) {
                this.values[i] = value;
                return;
            }
        }
        this.values.push(value);
    }

    isValidParameters(): boolean {
        if (this.values.length != this.parameters.length) {
            return false;
        } else {
            for (let i = 0; i < this.values.length; ++ i) {
                if (!this.values[i].status) {
                    return false;
                }
            }
            return true;
        }
    }
}
