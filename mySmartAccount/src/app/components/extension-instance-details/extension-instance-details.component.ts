import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-extension-instance-details',
    templateUrl: './extension-instance-details.component.html',
    styleUrls: ['./extension-instance-details.component.css']
})
export class ExtensionInstanceDetailsComponent implements OnInit {
  smartAccountAddress: string;
  extensionAddress: string;
  extensionInstanceIdentifier: string;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private zone : NgZone,
    private localStorageService: LocalStorageService) {}

    ngOnInit() {
        let self = this;
        this.route.params.subscribe(params => {
            self.smartAccountAddress = params["smartaccountaddress"];
            self.extensionAddress = params["extensionaddress"];
            self.extensionInstanceIdentifier = params["extensionidentifier"];
            if (!self.smartAccountAddress || !self.extensionAddress || !self.extensionInstanceIdentifier) {
                self.zone.run(() => self.router.navigate(['home']));
            } else {

            }
        });
    }
}