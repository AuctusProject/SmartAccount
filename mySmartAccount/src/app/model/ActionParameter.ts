import { ParameterUI } from "./ParameterUI";

export class ActionParameter {
    funcSignature: string;
    description: string;
    args: ParameterUI[] = new Array<ParameterUI>();

    constructor(funcSignature?: string, description?: string) {
        this.funcSignature = funcSignature;
        this.description = description;
    }

    addActionParameter(arg: ParameterUI){
        this.args.push(arg);
    }
}