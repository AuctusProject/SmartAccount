import * as utils from 'web3-utils';

export class AddressUtil {

public static isValid (address: string) : boolean {
        return utils.isAddress(address);
    }
}
