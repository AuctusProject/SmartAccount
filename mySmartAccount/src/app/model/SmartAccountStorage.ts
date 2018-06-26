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

    addExtension(address: string, dateUnix?: number): boolean {
        for(let i = 0; i < this.extensions.length; ++i) {
            if (this.extensions[i].address == address) {
                if (dateUnix) {
                    this.extensions[i].dateUnix = dateUnix;
                }
                return true;
            }
        }
        this.extensions.push(new ExtensionStorage(address, dateUnix));
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

    getAllExtensionList(chainId: string): ExtensionStorage[] {
        let marketPlaceExtensions = this.getMarketplaceExtensions(chainId);
        let allExtensions = [];
        for(let i = 0; i < this.extensions.length; ++i) { 
            allExtensions.push(this.extensions[i]);
        }
        for(let i = 0; i < marketPlaceExtensions.length; ++i) {
            let existing = false;
            for(let j = 0; j < this.extensions.length; ++j) { 
                if (this.extensions[j].address == marketPlaceExtensions[i].address) {
                    existing = true;
                    break;
                }
            }
            if (!existing) {
                allExtensions.push(marketPlaceExtensions[i]);
            }
        }
        return allExtensions;
    }

    getMarketplaceExtensions(chainId: string): ExtensionStorage[] {
        let result = [];
        switch (chainId) {
            case "1": 
                //result.push(new ExtensionStorage('', null));
                //result.push(new ExtensionStorage('', null));
                break;
            case "42":
                result.push(new ExtensionStorage('0x67c5ca5378472889683fa3c6e22cb3a408fb3950', null));
                result.push(new ExtensionStorage('0xc7f92c58847c1c506f59a19257f924eef9a03050', null));
                break;
            case "3":
                result.push(new ExtensionStorage('0xc8b40177ee3c704228079bc959af595e4396c81b', null));
                result.push(new ExtensionStorage('0xeaa98c7880254efad4cbdfb3321c435dbf54e35b', null));
                break;
            case "4":
                result.push(new ExtensionStorage('0x4581c9cd11efeaf9448d99ee5b91e8e9ca2425c8', null));
                result.push(new ExtensionStorage('0x7ddb6d5a79199266c7718c8f0f5abc2eb6a53413', null));
                break;
            default: 
                break;
        }
        return result;
    }
}