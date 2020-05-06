import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ProductState } from './store/product.state';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forFeature([ProductState])
  ]
})
export class ProductModule { }
