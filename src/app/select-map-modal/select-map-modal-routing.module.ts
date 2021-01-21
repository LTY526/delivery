import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectMapModalPage } from './select-map-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SelectMapModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectMapModalPageRoutingModule {}
