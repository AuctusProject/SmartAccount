import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { ParameterUI } from '../../../model/ParameterUI';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-extension-parameter-element',
    templateUrl: './extension-parameter-element.component.html',
    styleUrls: ['./extension-parameter-element.component.css']
})
export class ExtensionParameterElementComponent implements OnInit {
  
    @Input() smartAccountAddress: string;
    @Input() id: string;
    @Input() parameter: ParameterUI;
    @Input() setValue: any;
    @Input() description: string;
    @Input() forceEditable: boolean;
    @Output() parameterSet = new EventEmitter<any>();
    @Output() removed = new EventEmitter<string>();
    value: any;
    formIntegerRequiredCtrl = new FormControl('', [Validators.required,Validators.pattern(this.getPattern(1)),Validators.min(0)]);
    formFloatRequiredCtrl = new FormControl('', [Validators.required,Validators.pattern(this.getPattern(2)),Validators.min(0)]);
    formAddressRequiredCtrl = new FormControl('', [Validators.required,Validators.pattern(this.getPattern(3))]);
    formStringRequiredCtrl = new FormControl('', [Validators.required,Validators.pattern(this.getPattern(6))]);
    formDateRequiredCtrl = new FormControl('', [Validators.pattern(this.getPattern(5))]);
    formIntegerCtrl = new FormControl('', [Validators.pattern(this.getPattern(1)),Validators.min(0)]);
    formFloatCtrl = new FormControl('', [Validators.pattern(this.getPattern(2)),Validators.min(0)]);
    formAddressCtrl = new FormControl('', [Validators.pattern(this.getPattern(3))]);
    formStringCtrl = new FormControl('', [Validators.pattern(this.getPattern(6))]);
    formDateCtrl = new FormControl('', [Validators.pattern(this.getPattern(5))]);

    constructor() {}

    ngOnInit() {
        if (this.parameter.type == 8) {
            this.value = this.smartAccountAddress;
            this.parameter.isEditable = false;
        } else if (this.setValue) {
            this.value = this.setValue;
        } else if (this.parameter.type == 4) {
            this.value = false;
        }
        
        if (this.parameter.type == 4) {
            this.onCheck();
        } else if (!this.parameter.isEditable || this.setValue) { 
            this.parameterSet.emit({ id: this.id, status: true, value: this.value });
        }
    }

    showCheckbox(): boolean {
        return this.parameter.type == 4;
    }

    showDatepicker(): boolean {
        return this.parameter.type == 5;
    }

    showNumber(): boolean {
        return this.parameter.type == 1 || this.parameter.type == 2;
    }

    isDisabled(): boolean {
        return !this.forceEditable && !this.parameter.isEditable;
    }

    canRemoveArray(): boolean {
        return this.parameter.isArray && this.parameter.isEditable;
    }

    removeElement() {
        this.removed.emit(this.id);
    }

    onBlur() {
        this.parameterSet.emit({ id: this.id, status: this.getFormCtrl().valid, value: this.value });
    }

    onCheck() {
        this.parameterSet.emit({ id: this.id, status: true, value: this.value });
    }

    getFormCtrl(): FormControl {
        if (this.parameter.type == 1) {
            return this.parameter.isOptional ? this.formIntegerCtrl : this.formIntegerRequiredCtrl;
        } else if (this.parameter.type == 2) {
            return this.parameter.isOptional ? this.formFloatCtrl : this.formFloatRequiredCtrl;
        } else if (this.parameter.type == 3 || this.parameter.type == 8) {
            return this.parameter.isOptional ? this.formAddressCtrl : this.formAddressRequiredCtrl;
        } else if (this.parameter.type == 6 || this.parameter.type == 7) {
            return this.parameter.isOptional ? this.formStringCtrl : this.formStringRequiredCtrl;
        } else if (this.parameter.type == 5) {
            return this.parameter.isOptional ? this.formDateCtrl : this.formDateRequiredCtrl;
        }
    }

    getPattern(type?: number): string {
        let inputType = type ? type : this.parameter.type;
        if (inputType == 1) {
            return "^[0-9]*$";
        } else if (inputType == 2) {
            return "^[0-9]+(\.[0-9]+)?$";
        } else if (inputType == 3 || inputType == 8) {
            return "^(0x)?[0-9a-fA-F]{40}$";
        } else if (inputType == 6 || inputType == 7) {
            return "[\\s\\S]+";
        } else if (inputType == 5) {
            return "^[0-9][0-9][\/][0-9][0-9][\/][0-9][0-9][0-9][0-9]$";
        }
    }
}