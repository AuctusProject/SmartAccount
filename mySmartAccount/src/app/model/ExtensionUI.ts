import { ViewDataUI } from "./ViewDataUI";
import { ParameterDataUI } from "./ParameterDataUI";
import { ActionUI } from "./ActionUI";

export class ExtensionUI {
    name : string;
    description: string;
    actionsCount: number;
    viewDatasCount: number;
    setupParametersCount: number;
    setupParameters: ParameterDataUI[] = new Array<ParameterDataUI>();
    viewDataParameters: ViewDataUI[] = new Array<ViewDataUI>();
    actions: ActionUI[] = new Array<ActionUI>();

    constructor() {
    }

    addSetupParameter(setupParameter : ParameterDataUI){
        this.setupParameters.push(setupParameter);
    }

    addViewDataParameter(viewDataParameter : ViewDataUI){
        this.viewDataParameters.push(viewDataParameter);
    }

    addAction(action : ActionUI){
        this.actions.push(action);
    }

    getSetupWeb3Types(): string[] {
        var ret = [];
        this.setupParameters.forEach(element => {
            ret.push(element.ui.getWeb3Type());
        });
        return ret;
    }
}