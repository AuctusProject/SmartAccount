export class ExtensionSetupParameters{
    isEditable: boolean;
    description : string;
    type: number;
    isArray: boolean;
    value: string;

    constructor(isEditable: boolean, description : string, type: number, isArray: boolean ) {
        this.isEditable = isEditable;
        this.description = description;
        this.type = type;
        this.isArray = isArray;
      }

    public getType() {
        switch (this.type) {
            case 1:
                return "uint256";
            case 2:
                return "address";
            case 3:
                return "bool";
            case 4:
                return "string";
            default:
                return "bytes32";
          }
    }
}