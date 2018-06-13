import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ParameterUI } from '../../model/ParameterUI';
import { FormControl, Validators } from '@angular/forms';
import { ExtensionParameterElementComponent } from './extension-parameter-element/extension-parameter-element.component';

@Component({
    selector: 'app-extension-parameter',
    templateUrl: './extension-parameter.component.html',
    styleUrls: ['./extension-parameter.component.css']
})
export class ExtensionParameterComponent implements OnInit, OnDestroy {
  
    @Input() smartAccountAddress: string;
    @Input() index: number;
    @Input() parameter: ParameterUI;
    @Input() setValue: any;
    @Output() parameterSet = new EventEmitter<any>();
    elements: ComponentRef<ExtensionParameterElementComponent>[];
    arrayValues = new Array<any>();

    constructor(private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {}

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

    ngOnDestroy() {
        if (this.elements) {
            for(let i = 0; i < this.elements.length; ++i) {
                if (this.elements[i]) {
                    this.elements[i].destroy();
                }
            }
        }
    }

    isArray(): boolean {
        return this.parameter.isArray && this.parameter.type != 6 && this.parameter.type != 7 && this.parameter.type != 8;
    }

    getDescription(): string {
        return this.parameter.description + (this.parameter.isOptional ? "" : " *");
    }

    addNewElement(value?: any) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ExtensionParameterElementComponent);
        let component = this.viewContainerRef.createComponent(componentFactory);
        component.instance.parameter = this.parameter;
        component.instance.index = this.isArray() ? this.arrayValues.length : 0;
        component.instance.description = this.isArray() ? "" : this.getDescription();
        component.instance.smartAccountAddress = this.smartAccountAddress;
        component.instance.setValue = value;
        this.elements.push(component);

        let element = component.location.nativeElement;
        let sibling: HTMLElement = element.previousSibling;
        sibling.insertBefore(element, sibling.firstChild);
    }

    getRemoved(removedIndex: number) {
        this.arrayValues.splice(removedIndex, 1);
        this.emitArraySet(null);
    }

    getElementSet(element: any) {
        if (this.isArray()) {
            this.emitArraySet(element);
        } else {
            this.parameterSet.emit({ index: this.index, status: element.status, value: element.value });
        }
    }

    emitArraySet(element?: any) {
        let status = element ? element.status : true;
        let values = [];
        for (let i = 0; i < this.arrayValues.length; ++i) {
            if (element && element.index == i) {
                this.arrayValues[i] = element.value;
            }
            status = status && this.arrayValues[i].status;
            values.push(this.arrayValues[i].value);
        }
        if (element && element.index == this.arrayValues.length) {
            this.arrayValues.push({ status: element.status, value: element.value });
            values.push(element.value);
        }
        this.parameterSet.emit({ index: this.index, status: status, value: values });
    }
}