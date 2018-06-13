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
}