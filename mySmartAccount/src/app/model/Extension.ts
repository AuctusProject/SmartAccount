export class Extension{
    name : string;
    description: string;
    hasExtension: boolean;

    constructor(name : string, description : string) {
        this.name = name;
        this.description = description;
        this.hasExtension = false;
      }
}