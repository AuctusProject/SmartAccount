import { ViewDataUI } from "./ViewDataUI";
import { ParameterUI } from "./ParameterUI";
import { ActionUI } from "./ActionUI";

export class ExtensionUI {
    name : string;
    description: string;
    actionsCount: number;
    viewDatasCount: number;
    setupParametersCount: number;
    setupParameters: ParameterUI[] = new Array<ParameterUI>();
    viewDataParameters: ViewDataUI[] = new Array<ViewDataUI>();
    actions: ActionUI[] = new Array<ActionUI>();

    constructor() {
    }

    addSetupParameter(setupParameter : ParameterUI){
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
            ret.push(element.getWeb3Type());
        });
        return ret;
    }
}