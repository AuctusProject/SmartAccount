import { ExtensionIdentifierStorage } from "./ExtensionIdentifierStorage";

export class ExtensionStorage {
    address: string;
    dateUnix: number;
    rolesIds: string[] = new Array<string>();
    identifiers: ExtensionIdentifierStorage[] = new Array<ExtensionIdentifierStorage>();

    constructor(address?: string, dateUnix?: number, rolesIds?: string[]) {
        this.address = address;
        this.dateUnix = dateUnix;
        this.rolesIds = rolesIds ? rolesIds : new Array<string>();
    }

    getIdentifiersList(): string[] {
        let array = [];
        for(let i = 0; i < this.identifiers.length; ++i) {
            array.push(this.identifiers[i].identifier);
        }
        return array;
    }

    addRoleId(roleId: string): boolean {
        for(let i = 0; i < this.rolesIds.length; ++i) {
            if (this.rolesIds[i] == roleId) {
                return false;
            }
        }
        this.rolesIds.push(roleId);
        return true;
    }

    addIdentifier(name: string, identifier: string): boolean {
        for(let i = 0; i < this.identifiers.length; ++i) {
            if (this.identifiers[i].identifier == identifier) {
                this.identifiers[i].name = name;
                return true;
            }
        }
        this.identifiers.push(new ExtensionIdentifierStorage(name, identifier));
        return true;
    }

    setIdentifiers(readIdentifiers: string[]) {
        let removedIndexes: number[] = new Array<number>();
        for(let i = 0; i < this.identifiers.length; ++i) {
            for(let j = 0; j < readIdentifiers.length; ++j) {
                if (readIdentifiers[j] == this.identifiers[i].identifier) {
                    break;
                }
                removedIndexes.push(i);
            }
        }
        for(let i = 0; i < removedIndexes.length; ++i) {
            this.identifiers.splice(removedIndexes[i], 1);
        }
        let newIdentifiers: string[] = new Array<string>();
        for(let i = 0; i < readIdentifiers.length; ++i) {
            for(let j = 0; j < this.identifiers.length; ++j) {
                if (readIdentifiers[i] == this.identifiers[j].identifier) {
                    break;
                }
                newIdentifiers.push(readIdentifiers[i]);
            }
        }
        for(let i = 0; i < newIdentifiers.length; ++i) {
            this.identifiers.push(new ExtensionIdentifierStorage('Not defined ' + i, newIdentifiers[i]));
        }
    }
}