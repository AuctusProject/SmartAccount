import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtensionSetComponent } from './components/extension-set/extension-set.component';
import { ExtensionInstanceDetailsComponent } from './components/extension-instance-details/extension-instance-details.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { RedirectProvider } from './provider/redirect.provider';
import { ExtensionSetupComponent } from './components/extension-setup/extension-setup.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [RedirectProvider] },
    { path: 'account/:address', component: AccountComponent },
    { path: 'extension/:smartaccountaddress/:extensionaddress', component: ExtensionSetComponent },
    { path: 'extension-instance/:smartaccountaddress/:extensionaddress/:extensionidentifier', component: ExtensionInstanceDetailsComponent },
    { path: 'extension-setup/:smartaccountaddress/:extensionaddress', component: ExtensionSetupComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule { }
