import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopListPage } from './shop-list.page';

const routes: Routes = [
  {
    path: '',
    component: ShopListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopListPageRoutingModule {}
