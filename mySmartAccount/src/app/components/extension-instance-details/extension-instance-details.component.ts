import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { Web3Service } from '../../services/web3.service';

@Component({
    selector: 'app-extension-instance-details',
    templateUrl: './extension-instance-details.component.html',
    styleUrls: ['./extension-instance-details.component.css']
})
export class ExtensionInstanceDetails implements OnInit {
  smartAccountAddress: string;
  extensionAddress: string;
  extensionInstanceIdentifier: string;

  constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        let self = this;
        this.route.params.subscribe(params => {
            self.smartAccountAddress = params["smartaccountaddress"];
            self.extensionAddress = params["extensionaddress"];
            self.extensionInstanceIdentifier = params["extensionidentifier"];
        });
    }
}