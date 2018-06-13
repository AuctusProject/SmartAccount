import { Component, OnInit, NgZone, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ParameterUI } from '../../model/ParameterUI';

@Component({
  selector: 'app-extension-setup',
  templateUrl: './extension-setup.component.html',
  styleUrls: ['./extension-setup.component.css']
})
export class ExtensionSetupComponent implements OnInit {

    @Input() smartAccountAddress: string;
    @Input() disabled: boolean;
    @Input() expanded: boolean;
    @Input() parameters: ParameterUI[];
    @Input() values: any[];

    constructor(private route: ActivatedRoute, 
        private zone: NgZone, 
        private router: Router,
        private localStorageService: LocalStorageService,
        private smartAccountService: SmartAccountService) { }
    
    ngOnInit() {
    }
}
