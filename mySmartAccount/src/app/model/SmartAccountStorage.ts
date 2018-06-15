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
                result.push(new ExtensionStorage('0x94f1de751407dd25a7b865fa4d64a4b69080d5ed', null));
                result.push(new ExtensionStorage('0x6100f93f5c0b3b2a49af866a49ce5d4357f4934b', null));
                break;
            case "3":
                result.push(new ExtensionStorage('0x138eb47c578bf7f687fb9c1be43ba224f02dda10', null));
                result.push(new ExtensionStorage('0x21fcface25d5876a50cb61d2f939b8b8d5de9efb', null));
                break;
            case "4":
                result.push(new ExtensionStorage('0x63101c3fd1d6a7a5e0b04fbd79c326caa759b04c', null));
                result.push(new ExtensionStorage('0xe3cb8100e5f9fa616c386ddb158b73b9395c7ca4', null));
                break;
            default: 
                break;
        }
        return result;
    }
}