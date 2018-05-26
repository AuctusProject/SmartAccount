export class ExtensionSetupParameters{
    isEditable: boolean;
    description : string;
    type: number;
    isArray: boolean;

    constructor(isEditable: boolean, description : string, type: number, isArray: boolean ) {
        this.isEditable = isEditable;
        this.description = description;
        this.type = type;
        this.isArray = isArray;
      }
}