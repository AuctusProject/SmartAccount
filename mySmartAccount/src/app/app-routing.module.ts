import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTokenComponent } from './components/add-token/add-token.component';
import { ExtensionEditComponent } from './components/extension-edit/extension-edit.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { RedirectProvider } from './provider/redirect.provider';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [RedirectProvider] },
    { path: 'account', component: AccountComponent, data: {smartAccount:{}} },
    { path: 'extension', component: ExtensionEditComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule { }
