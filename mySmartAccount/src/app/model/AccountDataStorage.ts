import { SmartAccountStorage } from "./SmartAccountStorage";
import { ExtensionUI } from "./ExtensionUI";
import { ExtensionStorage } from "./ExtensionStorage";

export class AccountDataStorage {
    smartAccounts: SmartAccountStorage[] = new Array<SmartAccountStorage>();
    extensionUIs: ExtensionUI[] = new Array<ExtensionUI>();

    constructor() {
    }

    setExtensionUI(extensionUI: ExtensionUI): boolean {
        for(let i = 0; i < this.extensionUIs.length; ++i) {
            if (this.extensionUIs[i].address == extensionUI.address) {
                this.extensionUIs[i] = extensionUI;
                return true;
            }
        }
        this.extensionUIs.push(extensionUI);
        return true;
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

    updateSmartAccount(smartAccountStorage: SmartAccountStorage): boolean {
        for(let i = 0; i < this.smartAccounts.length; ++i) {
            if (this.smartAccounts[i].address == smartAccountStorage.address) {
                this.smartAccounts[i] = smartAccountStorage;
                return true;
            }
        }
        return false;
    }

    getSmartAccount(address: string): SmartAccountStorage {
        for(let i = 0; i < this.smartAccounts.length; ++i) {
            if (this.smartAccounts[i].address == address) {
                let sa = Object.assign(new SmartAccountStorage, this.smartAccounts[i]);
                if (sa && sa.extensions) {
                    let ext = new Array<ExtensionStorage>();
                    sa.extensions.forEach(element => {
                        ext.push(Object.assign(new ExtensionStorage, element));
                    });
                    sa.extensions = ext;
                }
                return sa;
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

    setExtensionIdentifiers(smartAccountAddress: string, extensionAddress: string, readIdentifiers: string[]): boolean {
        let smartAccount = this.getSmartAccount(smartAccountAddress);
        if (smartAccount) {
            return smartAccount.setExtensionIdentifiers(extensionAddress, readIdentifiers);
        }
        return false;
    }

    getExtensionUI(address: string): ExtensionUI {
        for(let i = 0; i < this.extensionUIs.length; ++i) {
            if (this.extensionUIs[i].address == address) {
                return this.extensionUIs[i];
            }
        }
        return null;
    }
}
