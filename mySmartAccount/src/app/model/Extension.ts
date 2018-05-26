import { ExtensionSetupParameters } from "./ExtensionSetupParameters";

export class Extension{
    address: string;
    name : string;
    description: string;
    active: boolean;
    actionsCount: number;
    viewDatasCount: number;
    setupParametersCount: number;
    setupParameters: ExtensionSetupParameters[];

    constructor(address: string, name? : string, description? : string) {
        this.address = address;
        this.name = name;
        this.description = description;
        this.active = false;
      }

    addSetupParameter(setupParameter : ExtensionSetupParameters){
        this.setupParameters.push(setupParameter);
    }
}