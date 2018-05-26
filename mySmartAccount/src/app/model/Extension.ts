export class Extension{
    address: string;
    name : string;
    description: string;
    active: boolean;

    constructor(address: string) {
        this.address = address;
        this.active = false;
      }
}