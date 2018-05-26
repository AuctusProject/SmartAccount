import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { AppRoutingModule } from './/app-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from "@angular/material/list";


import { AppComponent } from './app.component';
import { EthBalanceComponent } from './components/eth-balance/eth-balance.component';
import { ExtensionListComponent } from './components/extension-list/extension-list.component';
import { ExtensionListItemComponent } from './components/extension-list-item/extension-list-item.component';


@NgModule({
  declarations: [
    AppComponent,
    ExtensionListComponent,
    ExtensionListItemComponent,
    EthBalanceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatExpansionModule,
    MatCardModule,
    MatDividerModule,
    MatListModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
