import { SmartAccountStorage } from "./SmartAccountStorage";

export class AccountDataStorage {
    smartAccounts: SmartAccountStorage[] = new Array<SmartAccountStorage>();

    constructor() {
    }

    addSmartAccount(name: string, address: string): boolean {
        for(let i = 0; i < this.smartAccounts.length; ++i) {
            if (this.smartAccounts[i].address == address) {
                this.smartAccounts[i].name = name;
                return true;
            }
        }
        this.smartAccounts.push(new SmartAccountStorage(name, address));
        return true;
    }

    removeSmartAccount(address: string): boolean {
        for(let i = 0; i < this.smartAccounts.length; ++i) {
            if (this.smartAccounts[i].address == address) {
                this.smartAccounts.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    getSmartAccount(address: string): SmartAccountStorage {
        for(let i = 0; i < this.smartAccounts.length; ++i) {
            if (this.smartAccounts[i].address == address) {
                return this.smartAccounts[i];
            }
        }
        return null;
    } 

    addTokenData(smartAccountAddress: string, symbol: string, decimals: number, tokenAddress: string): boolean {
        let smartAccount = this.getSmartAccount(smartAccountAddress);
        if (smartAccount) {
            return smartAccount.addTokenData(symbol, decimals, tokenAddress);
        }
        return false;
    }

    removeTokenData(smartAccountAddress: string, tokenAddress: string): boolean {
        let smartAccount = this.getSmartAccount(smartAccountAddress);
        if (smartAccount) {
            return smartAccount.removeTokenData(tokenAddress);
        }
        return false;
    }

    addExtension(smartAccountAddress: string, extensionAddress: string): boolean {
        let smartAccount = this.getSmartAccount(smartAccountAddress);
        if (smartAccount) {
            return smartAccount.addExtension(extensionAddress);
        }
        return true;
    }

    setExtensionIdentifiers(smartAccountAddress: string, extensionAddress: string, readIdentifiers: string[]): boolean {
        let smartAccount = this.getSmartAccount(smartAccountAddress);
        if (smartAccount) {
            return smartAccount.setExtensionIdentifiers(extensionAddress, readIdentifiers);
        }
        return false;
    }
}