import { TokenStorage } from "./TokenStorage";
import { ExtensionStorage } from "./ExtensionStorage";

export class SmartAccountStorage {
    name: string;
    address: string;
    tokens: TokenStorage[] = new Array<TokenStorage>();
    extensions: ExtensionStorage[] = new Array<ExtensionStorage>();

    constructor(name?: string, address?: string){
        this.name = name;
        this.address = address;
    }

    addTokenData(symbol: string, decimals: number, address: string): boolean {
        for(let i = 0; i < this.tokens.length; ++i) {
            if (this.tokens[i].address == address) {
                this.tokens[i].decimals = decimals;
                this.tokens[i].symbol = symbol;
                return true;
            }
        }
        this.tokens.push(new TokenStorage(symbol, decimals, address));
        return true;
    }

    removeTokenData(address: string): boolean {
        for(let i = 0; i < this.tokens.length; ++i) {
            if (this.tokens[i].address == address) {
                this.tokens.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    addExtension(address: string): boolean {
        for(let i = 0; i < this.extensions.length; ++i) {
            if (this.extensions[i].address == address) {
                return true;
            }
        }
        this.extensions.push(new ExtensionStorage(address));
        return true;
    }

    removeExtension(address: string): boolean {
        for(let i = 0; i < this.extensions.length; ++i) {
            if (this.extensions[i].address == address) {
                this.extensions.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    setExtensionIdentifiers(extensionAddress: string, readIdentifiers: string[]): boolean {
        for(let i = 0; i < this.extensions.length; ++i) {
            if (this.extensions[i].address == extensionAddress) {
                this.extensions[i].setIdentifiers(readIdentifiers);
                return true;
            }
        }
        return false;
    }
}