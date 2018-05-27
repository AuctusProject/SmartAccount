import { ExtensionActionParameter } from "./ExtensionActionParameter";

export class ExtensionAction {
    funcSignature: string;
    description: string;
    actionParameters: ExtensionActionParameter[] = new Array<ExtensionActionParameter>();

    constructor(funcSignature: string, description: string) {
        this.funcSignature = funcSignature;
        this.description = description;
    }

    addActionParameter(actionParameter : ExtensionActionParameter){
        this.actionParameters.push(actionParameter);
    }
}