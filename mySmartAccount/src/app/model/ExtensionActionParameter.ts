export class ExtensionActionParameter{
    description : string;
    type: number;
    isArray: boolean;

    constructor(description : string, type: number, isArray: boolean ) {
        this.description = description;
        this.type = type;
        this.isArray = isArray;
      }
}