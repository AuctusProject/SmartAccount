import { Component } from '@angular/core';
import { Web3Service } from './services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public notificationOptions = {
    position: ["bottom", "left"],
    timeOut: 2500,
    maxStack: 1,
    preventDuplicates: true,
    preventLastDuplicates: "visible"
  }

  title = 'app';

  constructor(private web3Service: Web3Service) {

   }

   ngOnInit(): void {
     //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
     //Add 'implements OnInit' to the class.
     this.web3Service.hasWeb3().subscribe(()=>{});
   }
}
