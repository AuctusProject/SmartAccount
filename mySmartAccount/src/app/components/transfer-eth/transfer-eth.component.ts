import { Component, OnInit } from '@angular/core';
import { Web3Service } from "../../services/web3.service"; 

@Component({
  selector: 'app-transfer-eth',
  templateUrl: './transfer-eth.component.html',
  styleUrls: ['./transfer-eth.component.css']
})
export class TransferEthComponent implements OnInit {

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
  }

  private transferEth(): void {
    this.web3Service.getWeb3().subscribe(
      web3 => {
        if (web3) {
          this.web3Service.sendTransaction(1, 21000, "0x65b27BA7362ce3f241DAfDFC03Ef24D080e41413", 
            "0x65b27BA7362ce3f241DAfDFC03Ef24D080e41413", 0.1, null, null);
        }
      })
  }

}
