import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { AppRoutingModule } from './/app-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { EthBalanceComponent } from './components/eth-balance/eth-balance.component';
import { ExtensionListComponent } from './components/extension-list/extension-list.component';


@NgModule({
  declarations: [
    AppComponent,
    EthBalanceComponent,
    ExtensionListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatExpansionModule
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
