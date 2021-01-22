import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiderViewOrderPage } from './rider-view-order.page';

const routes: Routes = [
  {
    path: '',
    component: RiderViewOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiderViewOrderPageRoutingModule {}
