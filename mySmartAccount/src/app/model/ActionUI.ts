import { ParameterUI } from "./ParameterUI";

export class ActionUI {
    funcSignature: string;
    description: string;
    directlyCallFunction: boolean;
    args: ParameterUI[] = new Array<ParameterUI>();

    constructor(funcSignature?: string, directlyCallFunction?: boolean, description?: string) {
        this.funcSignature = funcSignature;
        this.directlyCallFunction = directlyCallFunction;
        this.description = description;
    }

    addActionParameter(arg: ParameterUI){
        this.args.push(arg);
    }
}