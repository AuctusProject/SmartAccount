import { ParameterDataUI } from "./ParameterDataUI";

export class ViewDataUI {
    funcSignature: string;
    output: ParameterDataUI;

    constructor(funcSignature?: string, output?: ParameterDataUI) {
        this.funcSignature = funcSignature;
        this.output = output;
      }
}