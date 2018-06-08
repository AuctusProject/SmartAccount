export class ParameterUI {
    description: string;
    type: number;
    decimals: number;
    isArray: boolean;
    isEditable: boolean;

    constructor(description?: string, type?: number, decimals?: number, isArray?: boolean, isEditable?: boolean) {
        this.description = description;
        this.type = type;
        this.decimals = decimals;
        this.isArray = isArray;
        this.isEditable = isEditable && type != 8;
    }

    getWeb3Type() {
        switch (this.type) {
            case 1:
                return "uint256";
            case 2:
                return "uint256";
            case 3:
                return "address";
            case 4:
                return "bool";
            case 5:
                return "uint256";
            case 6:
                return "string";
            case 8:
                return "address";
            default:
                return "bytes32";
          }
    }
}