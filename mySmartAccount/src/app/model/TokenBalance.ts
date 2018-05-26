export class TokenBalance{
    symbol : string;
    contractAddress : string;

    amount: number;

    constructor(symbol : string, amount : number, contractAddress? : string) {
        this.symbol = symbol;
        this.amount = amount;
        if (contractAddress){
            this.contractAddress = contractAddress;
        }
      }


}