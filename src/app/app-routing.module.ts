import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Main',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./initial/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./initial/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'shop-list',
    loadChildren: () => import('./shop-list/shop-list.module').then( m => m.ShopListPageModule)
  },
  {
    path: 'shop/:id',
    loadChildren: () => import('./shop/shop.module').then( m => m.ShopPageModule)
  },
  {
    path: 'cart-modal',
    loadChildren: () => import('./cart-modal/cart-modal.module').then( m => m.CartModalPageModule)
  },
  {
    path: 'select-map-modal',
    loadChildren: () => import('./select-map-modal/select-map-modal.module').then( m => m.SelectMapModalPageModule)
  },
  {
    path: 'view-order/:id',
    loadChildren: () => import('./view-order/view-order.module').then( m => m.ViewOrderPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
