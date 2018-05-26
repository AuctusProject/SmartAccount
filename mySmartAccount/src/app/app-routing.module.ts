import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTokenComponent } from './components/add-token/add-token.component';
import { ExtensionEditComponent } from './components/extension-edit/extension-edit.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'account/:address', component: AccountComponent },
    { path: 'extension/:id', component: ExtensionEditComponent },
    { path: 'add-token', component: AddTokenComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule { }
