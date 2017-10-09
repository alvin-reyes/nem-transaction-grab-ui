import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {DataTablesModule} from 'angular-datatables';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {NgxTypeaheadModule} from 'ngx-typeahead';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoadingModule} from 'ngx-loading';
import {ViewTransactionComponent} from './viewtransaction/viewtransaction.component';
import {DataTableModule} from 'angular-4-data-table';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    ViewTransactionComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    DataTablesModule,
    LoadingModule,
    DataTableModule,
    NgxTypeaheadModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        component: ViewTransactionComponent
      },
      {
        path: 'viewtransaction',
        component: ViewTransactionComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


}
