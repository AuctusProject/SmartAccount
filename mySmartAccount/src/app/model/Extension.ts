import { ExtensionSetupParameters } from "./ExtensionSetupParameters";
import { ExtensionViewDataParameters } from "./ExtensionViewDataParameters";
import { ExtensionAction } from "./ExtensionAction";

export class Extension{
    address: string;
    name : string;
    description: string;
    active: boolean;
    actionsCount: number;
    viewDatasCount: number;
    setupParametersCount: number;
    setupParameters: ExtensionSetupParameters[] = new Array<ExtensionSetupParameters>();
    viewDataParameters: ExtensionViewDataParameters[] = new Array<ExtensionViewDataParameters>();
    actions: ExtensionAction[] = new Array<ExtensionAction>();

    constructor(address: string, name? : string, description? : string) {
        this.address = address;
        this.name = name;
        this.description = description;
        this.active = false;
      }

    addSetupParameter(setupParameter : ExtensionSetupParameters){
        this.setupParameters.push(setupParameter);
    }
    addViewDataParameter(viewDataParameter : ExtensionViewDataParameters){
        this.viewDataParameters.push(viewDataParameter);
    }
    addAction(action : ExtensionAction){
        this.actions.push(action);
    }

    public returnSetupTypes(): string[] {
        var ret = [];
        this.setupParameters.forEach(element => {
            ret.push(element.getType());
        });
        return ret;
    }
}