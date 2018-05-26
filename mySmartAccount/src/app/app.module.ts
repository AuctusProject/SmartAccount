import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './/app-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LocalStorageService } from './services/local-storage.service';
import { FormsModule } from '@angular/forms';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppComponent } from './app.component';
import { EthBalanceComponent } from './components/eth-balance/eth-balance.component';
import { ExtensionListComponent } from './components/extension-list/extension-list.component';
import { ExtensionListItemComponent } from './components/extension-list-item/extension-list-item.component';
import { TransferEthComponent } from './components/transfer-eth/transfer-eth.component';
import { TokenListComponent } from './components/token-list/token-list.component';
import { Web3Service } from './services/web3.service';
import { SmartAccountService } from './services/smart-account.service';
import { EventsServiceModule } from 'angular-event-service';
import { ExtensionEditComponent } from './components/extension-edit/extension-edit.component';
import { HomeComponent } from './components/home/home.component';
import { TokenListItemComponent } from './components/token-list/token-list-item/token-list-item.component';
import { AddTokenComponent } from './components/add-token/add-token.component';
import { MetamaskAccountMonitorComponent } from './components/metamask-account-monitor/metamask-account-monitor.component';
import { TransferTokenComponent } from './components/transfer-token/transfer-token.component';


@NgModule({
  declarations: [
    AppComponent,
    ExtensionListComponent,
    ExtensionListItemComponent,
    EthBalanceComponent,
    TransferEthComponent,
    TokenListComponent,
    ExtensionEditComponent,
    HomeComponent,
    TokenListItemComponent,
    AddTokenComponent,
    MetamaskAccountMonitorComponent,
    TransferTokenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatExpansionModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    EventsServiceModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ],

  providers: [
    LocalStorageService,
    Web3Service,
    SmartAccountService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
