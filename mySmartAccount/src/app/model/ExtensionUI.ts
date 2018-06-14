import { ViewDataUI } from "./ViewDataUI";
import { ParameterUI } from "./ParameterUI";
import { ActionUI } from "./ActionUI";
import { GeneralUtil } from "../util/generalUtil";

export class ExtensionUI {
    address: string;
    name: string;
    description: string;
    actionsCount: number;
    viewDatasCount: number;
    setupParametersCount: number;
    setupFunctionSignature: string;
    setupParameters: ParameterUI[] = new Array<ParameterUI>();
    viewDataParameters: ViewDataUI[] = new Array<ViewDataUI>();
    actions: ActionUI[] = new Array<ActionUI>();
    rolesIds: string[] = new Array<string>();

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
            ret.push(GeneralUtil.getWeb3Type(element));
        });
        return ret;
    }
}