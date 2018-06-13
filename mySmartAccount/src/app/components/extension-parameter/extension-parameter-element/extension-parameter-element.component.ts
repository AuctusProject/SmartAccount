import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { ParameterUI } from '../../../model/ParameterUI';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-extension-parameter-element',
    templateUrl: './extension-parameter-element.component.html',
    styleUrls: ['./extension-parameter-element.component.css']
})
export class ExtensionParameterElementComponent implements OnInit {
  
    @Input() smartAccountAddress: string;
    @Input() index: number;
    @Input() parameter: ParameterUI;
    @Input() setValue: any;
    @Input() description: string;
    @Output() parameterSet = new EventEmitter<any>();
    @Output() removed = new EventEmitter<number>();
    value: any;
    formRequiredCtrl = new FormControl('', [Validators.required,Validators.pattern(this.getPattern())]);
    formCtrl = new FormControl('', [Validators.pattern(this.getPattern())]);

    constructor() {}

    ngOnInit() {
        if (this.parameter.type == 8) {
            this.value = this.smartAccountAddress;
            this.parameter.isEditable = false;
        } else if (this.setValue) {
            this.value = this.setValue;
        }
        
        if (this.parameter.type == 4) {
            this.onCheck();
        } else if (!this.parameter.isEditable || this.setValue) { 
            this.parameterSet.emit({ index: this.index, status: true, value: this.value });
        }
    }

    removeElement() {
        this.removed.emit(this.index);
    }

    onBlur() {
        this.parameterSet.emit({ index: this.index, status: this.formCtrl.valid, value: this.value });
    }

    onCheck() {
        this.parameterSet.emit({ index: this.index, status: true, value: this.value });
    }

    getFormCtrl(): string {
        return this.parameter.isOptional ? "formCtrl" : "formRequiredCtrl";
    }

    getType(): string {
        if (this.parameter.type == 1 || this.parameter.type == 2) {
            return "number";
        } else if (this.parameter.type == 3 || this.parameter.type == 6  || this.parameter.type == 7 || this.parameter.type == 8) {
            return "text";
        }
    }

    getPattern(): string {
        if (this.parameter.type == 1) {
            return "^[0-9]*$";
        } else if (this.parameter.type == 2) {
            return "^[0-9]+(\.[0-9]+)?$";
        } else if (this.parameter.type == 3 || this.parameter.type == 8) {
            return "^(0x)?[0-9a-fA-F]{40}$";
        } else if (this.parameter.type == 6 || this.parameter.type == 7) {
            return "[\s\S]+";
        } else if (this.parameter.type == 5) {
            return "^[0-9][0-9][\/][0-9][0-9][\/][0-9][0-9][0-9][0-9]$";
        }
    }
}