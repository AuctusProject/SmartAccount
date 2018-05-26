export class Extension{
    address: string;
    name : string;
    description: string;
    active: boolean;

    constructor(address: string, name : string, description : string) {
        this.address = address;
        this.name = name;
        this.description = description;
        this.active = false;
      }
}