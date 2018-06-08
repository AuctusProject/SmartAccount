import { ParameterUI } from "./ParameterUI";

export class ParameterDataUI {
    value: any;
    ui: ParameterUI;

    constructor(ui?: ParameterUI, value?: any) {
        this.ui = ui;
        this.value = value;
      }
}