import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'items',
    loadChildren: () => import('./product/list/product-list.module').then(m => m.ProductListModule)
  }, {
    path: 'items/:id',
    loadChildren: () => import('./product/detail/product-detail.module').then(m => m.ProductDetailModule)
  },
  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
