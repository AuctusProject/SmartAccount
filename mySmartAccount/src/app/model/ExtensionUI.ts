import { ViewDataParameter } from "./ViewDataParameter";
import { ParameterDataUI } from "./ParameterDataUI";
import { ActionParameter } from "./ActionParameter";

export class ExtensionUI {
    name : string;
    description: string;
    actionsCount: number;
    viewDatasCount: number;
    setupParametersCount: number;
    setupParameters: ParameterDataUI[] = new Array<ParameterDataUI>();
    viewDataParameters: ViewDataParameter[] = new Array<ViewDataParameter>();
    actions: ActionParameter[] = new Array<ActionParameter>();

    constructor() {
    }

    addSetupParameter(setupParameter : ParameterDataUI){
        this.setupParameters.push(setupParameter);
    }

    addViewDataParameter(viewDataParameter : ViewDataParameter){
        this.viewDataParameters.push(viewDataParameter);
    }

    addAction(action : ActionParameter){
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