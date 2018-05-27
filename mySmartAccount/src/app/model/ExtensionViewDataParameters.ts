export class ExtensionViewDataParameters{
    funcSignature: string;
    description : string;
    type: number;
    isArray: boolean;
    value: string;

    constructor(funcSignature: string, description : string, type: number, isArray: boolean ) {
        this.funcSignature = funcSignature;
        this.description = description;
        this.type = type;
        this.isArray = isArray;
      }
}