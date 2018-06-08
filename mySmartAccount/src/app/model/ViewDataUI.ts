import { ParameterUI } from "./ParameterUI";

export class ViewDataUI {
    funcSignature: string;
    output: ParameterUI;

    constructor(funcSignature?: string, output?: ParameterUI) {
        this.funcSignature = funcSignature;
        this.output = output;
      }
}