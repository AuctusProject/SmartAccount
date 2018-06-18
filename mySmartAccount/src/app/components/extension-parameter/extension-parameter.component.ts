import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ParameterUI } from '../../model/ParameterUI';
import { FormControl, Validators } from '@angular/forms';
import { ExtensionParameterElementComponent } from './extension-parameter-element/extension-parameter-element.component';

@Component({
    selector: 'app-extension-parameter',
    templateUrl: './extension-parameter.component.html',
    styleUrls: ['./extension-parameter.component.css']
})
export class ExtensionParameterComponent implements OnInit {
  
    @Input() smartAccountAddress: string;
    @Input() index: number;
    @Input() parameter: ParameterUI;
    @Input() setValue: any;
    @Output() parameterSet = new EventEmitter<any>();
    elements = new Array<any>();

    constructor() {}

    ngOnInit() {
        if (this.isArray()) {
            if (this.setValue && this.setValue.length > 0) {
                for(let i = 0; i < this.setValue.length; ++i) {
                    this.addNewElement(this.setValue[i]);
                }
            } else {
                this.addNewElement(null);
            }
        } else {
            this.addNewElement(this.setValue);
        }
    }

    isArray(): boolean {
        return this.parameter.isArray && this.parameter.type != 6 && this.parameter.type != 7 && this.parameter.type != 8;
    }

    getDescription(): string {
        return this.parameter.description + (this.parameter.isOptional ? "" : " *");
    }

    addNewElement(value?: any) {
        this.elements.push({ 
            parameter: this.parameter,
            id: this.getNextId(),
            description: this.isArray() ? "" : this.getDescription(),
            smartAccountAddress: this.smartAccountAddress,
            setValue: value
        });
    }

    getNextId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }

    getRemoved(removedId: string) {
        for (let i = 0; i < this.elements.length; ++i) {
            if (this.elements[i].id == removedId) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.emitArraySet(null);
    }

    getElementSet(element: any) {
        if (this.isArray()) {
            this.emitArraySet(element);
        } else {
            this.parameterSet.emit({ index: this.index, status: element.status, value: this.getFormattedValue(element.value) });
        }
    }

    emitArraySet(element?: any) {
        let status = true;
        let values = [];
        for (let i = 0; i < this.elements.length; ++i) {
            if (element && element.id == this.elements[i].id) {
                this.elements[i]["value"] = this.getFormattedValue(element.value);
                this.elements[i]["status"] = element.status;
            }
            status = status && this.elements[i]["status"];
            values.push(this.elements[i]["value"]);
        }
        this.parameterSet.emit({ index: this.index, status: status, value: values });
    }

    getFormattedValue(value: any) {
        if (!value && value != 0) {
            return "";
        } else if (this.parameter.type == 3 || this.parameter.type == 7 || this.parameter.type == 8) {
            let valueLower = value.toLowerCase();
            return valueLower.startsWith("0x") ? valueLower : "0x" + valueLower;
        } else if (this.parameter.type == 5) {
            return value.getTime() / 1000;
        } else if (this.parameter.type == 1 || this.parameter.type == 2) {
            return value * (this.parameter.decimals > 1 ? this.parameter.decimals : 1);
        } else {
            return value;
        }
    }
}