import { Component, OnInit, NgZone, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ParameterUI } from '../../model/ParameterUI';


@Component({
  selector: 'app-extension-parameter-group',
  templateUrl: './extension-parameter-group.component.html',
  styleUrls: ['./extension-parameter-group.component.css']
})
export class ExtensionParameterGroupComponent implements OnInit {

    @Input() title: string;
    @Input() actionButtonName: string;
    @Input() functionSignature: string;
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

    execute() {
        
    }
}
