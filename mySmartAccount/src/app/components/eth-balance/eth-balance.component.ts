import { Component, OnInit } from '@angular/core';
import { EventsService } from 'angular-event-service';
import { SmartAccountService } from '../../services/smart-account.service';

@Component({
  selector: 'app-eth-balance',
  templateUrl: './eth-balance.component.html',
  styleUrls: ['./eth-balance.component.css']
})
export class EthBalanceComponent implements OnInit {

  ethBalance: number;

  constructor(private smartAccountService: SmartAccountService, private eventsService: EventsService) {
    this.eventsService.on("loginConditionsSuccess", this.onLoginConditionsSuccess);
  }

  ngOnInit() {
    this.smartAccountService.getAccountETHBalance().subscribe(balance => {
      this.ethBalance = balance;
    });
  }

  ngOnDestroy(): void {
    this.eventsService.destroyListener("loginConditionsSuccess", this.onLoginConditionsSuccess);
  }

  private onLoginConditionsSuccess: Function = (payload: any) => {
    this.smartAccountService.getAccountETHBalance().subscribe(balance => {
      this.ethBalance = balance;
    });
  }

}
