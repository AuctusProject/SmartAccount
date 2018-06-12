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
import { FormsModule } from '@angular/forms';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons/dist';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiSwitchModule } from 'angular2-ui-switch'
import { LocalStorageService } from './services/local-storage.service';
import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './app.component';
import { EthBalanceComponent } from './components/account/eth-balance/eth-balance.component';
import { ExtensionListComponent } from './components/account/extension-list/extension-list.component';
import { TokenListComponent } from './components/account/token-list/token-list.component';
import { Web3Service } from './services/web3.service';
import { SmartAccountService } from './services/smart-account.service';
import { EventsServiceModule } from 'angular-event-service';
import { ExtensionSetComponent } from './components/extension-set/extension-set.component';
import { ExtensionInstanceDetailsComponent } from './components/extension-instance-details/extension-instance-details.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { RedirectProvider } from './provider/redirect.provider';
import { ExtensionService } from './services/extension.service';


@NgModule({
  declarations: [
    AppComponent,
    ExtensionListComponent,
    EthBalanceComponent,
    TokenListComponent,
    ExtensionSetComponent,
    HomeComponent,
    AccountComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatExpansionModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    UiSwitchModule,
    FlexLayoutModule,
    EventsServiceModule.forRoot(),
    Angular2PromiseButtonModule
      .forRoot({
        spinnerTpl: '<span class="btn-spinner"></span>',
        disableBtn: true,
        btnLoadingClass: 'is-loading',
        handleCurrentBtnOnly: true,
      }),
    FormsModule
  ],

  providers: [
    LocalStorageService,
    Web3Service,
    SmartAccountService,
    RedirectProvider,
    ExtensionService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
