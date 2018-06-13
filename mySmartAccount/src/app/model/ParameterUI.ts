export class ParameterUI {
    description: string;
    type: number;
    decimals: number;
    isArray: boolean;
    isEditable: boolean;
    isOptional: boolean;

    constructor(description?: string, type?: number, decimals?: number, isArray?: 
        boolean, isEditable?: boolean, isOptional?: boolean) {
        this.description = description;
        this.type = type;
        this.decimals = decimals;
        this.isArray = isArray;
        this.isEditable = isEditable;
        this.isOptional = isOptional;
    }

    getWeb3Type() {
        let append = this.isArray ?  "[]" : "";
        if (this.type == 1 || this.type == 2 || this.type == 5) {
            return "uint256" + append;
        } else if (this.type == 4) {
            return "bool" + append;
        } else if (this.type == 3 || this.type == 8) {
            return "address" + append;
        } else if (this.type == 6) {
            return "string";
        } else {
            return "bytes";
        }
    }
}