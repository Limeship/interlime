import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InterlimeModule} from "../../../interlime/src/lib/interlime.module";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), InterlimeModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
