export class TokenStorage {
    symbol: string;
    decimals: number;
    address: string;

    balance: number;

    constructor(symbol?: string, decimals?: number, address?: string){
        this.symbol = symbol;
        this.decimals = decimals;
        this.address = address;
    }
}