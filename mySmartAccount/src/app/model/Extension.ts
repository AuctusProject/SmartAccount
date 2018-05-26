export class Extension{
    id: number;
    name : string;
    description: string;
    active: boolean;

    constructor(id: number, name : string, description : string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = false;
      }
}