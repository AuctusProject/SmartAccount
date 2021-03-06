import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from '../../services/local-storage.service';
import { Web3Service } from '../../services/web3.service';
import { SmartAccountService } from '../../services/smart-account.service';
import { ExtensionData } from '../../model/ExtensionData';
import { Router } from '@angular/router';
import { ExtensionStorage } from '../../model/ExtensionStorage';
import { GeneralUtil } from '../../util/generalUtil';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-extension-set',
  templateUrl: './extension-set.component.html',
  styleUrls: ['./extension-set.component.css']
})
export class ExtensionSetComponent implements OnInit {

  smartAccountAddress: string;
  extensionAddress: string;
  active: boolean;
  executing: boolean;
  roles: string[];
  name: string;
  description: string;
  note: string;
  promise: Subscription;

  constructor(private route: ActivatedRoute, 
    private zone: NgZone, 
    private router: Router,
    private localStorageService: LocalStorageService,
    private web3Service: Web3Service,
    private smartAccountService: SmartAccountService,
    public dialog: MatDialog) { }
    
  ngOnInit() {
    let self = this;
    this.route.params.subscribe(params => {
      self.smartAccountAddress = params["smartaccountaddress"];
      self.extensionAddress = params["extensionaddress"];
      if (!self.smartAccountAddress || !self.extensionAddress) {
        self.zone.run(() => self.router.navigate(['home']));
      } else {
        let ui = self.localStorageService.getAccountData().getExtensionUI(self.extensionAddress);
        if (!ui) {
          self.zone.run(() => self.router.navigate(['home']));
        } else {
          self.name = ui.name;
          self.description = ui.description;
          self.roles = GeneralUtil.getRolesNames(ui.rolesIds);
          let allExtensions = self.localStorageService.getAccountData().getSmartAccount(self.smartAccountAddress).getAllExtensionList(self.smartAccountService.getNetwork());
          for (let i = 0; i < allExtensions.length; ++i) {
            if (allExtensions[i].address == self.extensionAddress) {
              self.active = !!allExtensions[i].dateUnix;
              break;
            }
          }
          self.note = !self.active ? "After activating, you also need configure the extension settings." 
            : "After deactivating, all existing extension's settings will be disabled.";
          self.executing = false;
        }
      }
    });
  }

  getBackDestination() {
    return ['account', this.smartAccountAddress];
  }

  back() {
    this.zone.run(() => this.router.navigate(this.getBackDestination()));
  }

  getActionName() {
    return this.active ? "DEACTIVATE" : "ACTIVATE";
  }

  setAction() {
    let self = this;
    this.executing = true;
    if (!this.active) {
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { text: "Do you really want to authorize this extension?", cancelLabel: "Cancel", confirmationLabel: "Confirm" }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.promise = this.smartAccountService.addExtension(this.smartAccountAddress, this.extensionAddress).subscribe(txHash => {
          self.web3Service.isSuccessfullyMinedTransaction(txHash).subscribe(ret => {
              self.executing = false;
              if (ret) {
                  self.zone.run(() => self.router.navigate(['extension-setup', self.smartAccountAddress, self.extensionAddress]));
              } else {
                this.dialog.open(ConfirmationDialogComponent, {
                  data: { customTitle: "Oops!", hideConfirmation: true, text: "The smart contract creation failed." }
                });
              }
            });
          });
        }
      });
    } else {
      this.promise = this.smartAccountService.removeExtension(this.smartAccountAddress, this.extensionAddress).subscribe(txHash => {
        self.web3Service.isSuccessfullyMinedTransaction(txHash).subscribe(ret => {
          self.executing = false;
          if (ret) {
            self.back();
          } else {
            this.dialog.open(ConfirmationDialogComponent, {
              data: { customTitle: "Oops!", hideConfirmation: true, text: "The smart contract creation failed." }
            });
          }
        });
      });
    }
  }
}
