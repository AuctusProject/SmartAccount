
import { ExtensionIdentifier } from "./ExtensionIdentifier";
import { ExtensionSetupParameters } from "./ExtensionSetupParameters";
import { ExtensionViewDataParameters } from "./ExtensionViewDataParameters";
import { ExtensionAction } from "./ExtensionAction";

export class Extension {
    address: string;
    dateUnix: number;
    rolesIds: string[] = new Array<string>();
    identifiers: ExtensionIdentifier[] = new Array<ExtensionIdentifier>();

    name : string;
    description: string;
    actionsCount: number;
    viewDatasCount: number;
    setupParametersCount: number;
    setupParameters: ExtensionSetupParameters[] = new Array<ExtensionSetupParameters>();
    viewDataParameters: ExtensionViewDataParameters[] = new Array<ExtensionViewDataParameters>();
    actions: ExtensionAction[] = new Array<ExtensionAction>();

    constructor(address?: string, dateUnix?: number) {
        this.address = address;
        this.dateUnix = dateUnix;
    }

    addRoleId(roleId: string) {
        this.rolesIds.push(roleId);
    }

    addIdentifier(identifier: string) {
        this.identifiers.push(new ExtensionIdentifier(identifier));
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