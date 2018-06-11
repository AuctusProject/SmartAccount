import { Component, OnInit, NgZone, Input } from '@angular/core';
import { SmartAccountService } from '../../services/smart-account.service';
import { EventsService } from "angular-event-service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() backDestination: string[];
  chain: string;
  unlocked: boolean;
  
  constructor(private smartAccountService: SmartAccountService,
    private eventsService: EventsService,
    private router: Router, 
    private zone : NgZone) {
  }

  ngOnInit() {
    this.eventsService.on("accountChanged", this.onAccountChanged);
    this.eventsService.on("loginConditionsFail", this.onLoginConditionsFail);
    this.eventsService.on("loginConditionsSuccess", this.onLoginConditionsSuccess);
    this.setData();
  }

  ngOnDestroy() {
    this.eventsService.destroyListener("accountChanged", this.onAccountChanged);
    this.eventsService.destroyListener("loginConditionsFail", this.onLoginConditionsFail);
    this.eventsService.destroyListener("loginConditionsSuccess", this.onLoginConditionsSuccess);
  }

  private onLoginConditionsFail: Function = (payload: any) => {
    this.setData();
  }

  private onLoginConditionsSuccess: Function = (payload: any) => {
    this.setData();
  }

  private onAccountChanged: Function = (payload: any) => {
    window.location.reload();
  }

  back() {
    this.zone.run(() => this.router.navigate(this.backDestination));
  }

  setData() {
    this.unlocked = !!this.smartAccountService.getAccount();
    let chainId = this.smartAccountService.getNetwork();
    switch (chainId) {
        case "1":
            this.chain = 'Mainnet';
            break;
        case "2":
            this.chain = 'Ropsten';
            break;
        case "3":
            this.chain = 'Kovan';
            break;
        case "4":
            this.chain = 'Rinkeby';
            break;
        default: 
            this.chain = 'Undefined';
            break;
    }
  }
}
