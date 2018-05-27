<img src="http://dl.auctus.org/img/logos/auctus_logo.png" width="200px" >

---

# Smart Accounts & Pluggable Smart Contracts 
## ETHBuenosAires Project
### Auctus Team (Ariny, Gusman, Vitorino, Duarte)

Smart accounts are smart contracts meant to be used as wallets (they hold and transfer ETH and tokens) and that can be expanded using external plugins.

### Inspiration
To enable mainstream adoption of Blockchain technology and the Ethereum network, we need to make it easier for non tech-savvy users: users should not fear losing all their funds because of they lost a private key and they should be able to add features that go beyond holding and transfering ETH and tokens.

### What it does
A new Dapp is introduced to manage the smart accounts. The main smart contract is a "smart account" that can be expanded by adding extensions or plugins, which consist of other smart contracts which implement the IExtension interface and add functionalities to the smart account, making it more than a regular wallet.

A smart account can have more than one owner (using SignatureBouncer.sol from Open Zeppelin) and can allow external plugins to execute actions/tasks on behalf of the smart account. Examples of functionalities/plugins (which were implemented during the ETHBuenosAires hackathon):

* Recurring Payments - to emulate an "automatic debiting" functionality, the RecurringPayment smart contract allows a service provider to periodically withdraw ETH or tokens from the smart account. The rules (max amount, period, number of payments, beneficiary) are defined in the plugin smart contract. This plugin is implemented on the RecurringPayment.sol smart contract and there is one additional feature to be implemented (RecurringPaymentWithDAI.sol): the service provider might be interested to receive in DAI instead of ETH (to avoid being exposed to price volatility), so the plugin would convert ETH to DAI using the Oasis Dex smart contracts.
* Fund Recovery - With the "Fund Recovery" extension plugin, the owner/creator of a smart account can assign a list of "trusted" providers that can transfer ownership of the smart account in case of access loss (for instance, if you lose the private key of the owner). The owner sets a list of addresses, a minimum number of confirmations from distinct providers from the "trusted" list, and a period of time during which the owner can cancel the process of transferring ownership of the smart account (even if all "security providers" collude and try to transfer the smart account ownership to an address the owner doesn’t control, there is a delay during which the owner can cancel this Ownership transfer and subsequently change the list of providers). Implemented on the RecoveryFunds.sol smart contract.
* RCN "NanoLoanEngine" Lender - A plugin that defines desired parameters (max amount, whitelist of borrowers / loan creators, min interest rate, max period for loan, etc) for lending RCN tokens using the NanoLoanEngine (from rcn-network) using the smart account (RCNNanoLender.sol).

Several other features/plugins can be created to extend a smart account's functionalities. The idea is to be as flexible as possible, being very simple to connect to new extensions that implement the IExtension.sol interface, so users can gradually move from using regular wallets to adopt smart accounts. Example of features which were not implemented during the hackathon: testament (transfer of funds in case of death), mixer (for privacy) and so on.

### How we built it
A mobile-first dapp was built using Angular 5 and web3 to interact with the Ethereum network using Metamask or Toshi. The core of the smart account and plugins are smart contracts written in Solidity. The dapp screens are flexible: the frontend reads the metadata and parameters from the plugin smart contracts and automatically renders the fields based on each plugin. Anyone can build a custom plugin that will be automatically rendered on the dapp by implementing the IExtension.sol interface (including metadata methods such as getName, getDescription, getActions, etc).

### Challenges we ran into
The first challenge was to define the standard interface which allows the flexibility needed for expandable smart accounts to work (flexible dapp that interprets the plugin definitions).

The second challenge was to integrate with other tools or smart contracts that are on different testnets. 

The third challenge was time: the smart account implementation and testing needs to be continued after the hackathon for it to achieve its full potential.

### Accomplishments that we're proud of
We're proud of developing a tool that we ourselves would use and that could help less experienced users to manage their own funds instead of relying on centralized exchanges without the fear of losing all the funds due to private key loss. A solution similar to the implemented smart account is inevitable to become popular in the near future.

### What we learned
We learned more about OpenZeppelin contracts, about RCN Network, about Toshi and about DAI and Oasis Dex.
We also challenged ourselves to create a dapp without a traditional backend/database architecture which uses only Angular frontend and the Ethereum network.

### What's next for Smart Accounts
Improve the user experience;
Add more plugins;
Thoroughly testing / auditing;
Add governance in the plugin creation and offering process to avoid malicious behavior.