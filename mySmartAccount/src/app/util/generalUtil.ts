import { ParameterUI } from "../model/ParameterUI";

export class GeneralUtil {

    public static getWeb3Type(parameter: ParameterUI): string {
        let append = parameter.isArray ?  "[]" : "";
        if (parameter.type == 1 || parameter.type == 2 || parameter.type == 5) {
            return "uint256" + append;
        } else if (parameter.type == 4) {
            return "bool" + append;
        } else if (parameter.type == 3 || parameter.type == 8) {
            return "address" + append;
        } else if (parameter.type == 6) {
            return "string";
        } else if (parameter.type == 9) {
            return "bytes32";
        } else {
            return "bytes";
        }
    }

    public static getRolesNames(rolesIds?: string[]): string[] {
        let names = [];
        if (rolesIds) {
            for(let i = 0; i < rolesIds.length; ++i) {
                switch(rolesIds[i])
                {
                    case "0xd5342cfae8cfcd762ee9ec644e43767d823c2d2f1ea741cbb93224eaa6b8449e":
                        names.push("Transfer Tokens");
                        break;
                    case "0x8f18f658d37b632619e90699ac1fae34e82c1a03435ac5dc930259af8e29e56c":
                        names.push("Transfer Ethers");
                        break;
                    case "0x4ea3bb1eaa05b77c4b0eeee0116a3177c6d62319dd7149ae148185d9e09de74a":
                        names.push("Transfer Ownership");
                        break;
                    default:
                        break;
                }
            }
        }
        return names;
    }
}