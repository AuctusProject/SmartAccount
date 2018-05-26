import { Component, OnInit } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { EventsService } from 'angular-event-service';

@Component({
  selector: 'app-eth-balance',
  templateUrl: './eth-balance.component.html',
  styleUrls: ['./eth-balance.component.css']
})
export class EthBalanceComponent implements OnInit {

  ethBalance : number;

  constructor(private smartAccountService : SmartAccountService, private eventsService: EventsService) {
    this.eventsService.on("loginConditionsSuccess", this.onLoginConditionsSuccess);

   }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.eventsService.destroyListener("loginConditionsSuccess", this.onLoginConditionsSuccess);  
  }

  private onLoginConditionsSuccess: Function = (payload: any) => {
    //this.ethBalance = this.smartAccountService.getAccountETHBalance();
  }

}
