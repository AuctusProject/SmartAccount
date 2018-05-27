export class ExtensionData {
    setupParameters: any[];
    viewDataParameters: any[];

    addSetupParameters(setupParameters : any[]) {
        this.setupParameters = setupParameters;
    }

    addViewParameterParameters(viewDataParameter : any) {
        this.viewDataParameters.push(viewDataParameter);
    }
}