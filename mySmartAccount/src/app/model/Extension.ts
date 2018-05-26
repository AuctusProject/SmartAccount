export class Extension{
    name : string;
    description: string;
    active: boolean;

    constructor(name : string, description : string) {
        this.name = name;
        this.description = description;
        this.active = false;
      }
}