import { ParameterUI } from "../model/ParameterUI";

export class ParameterUtil {

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
        } else {
            return "bytes";
        }
    }
}