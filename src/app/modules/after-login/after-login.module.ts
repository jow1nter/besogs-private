import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AfterLoginRouteModule } from './after-login-route.module';
import { MaterialModule } from './../../material.module';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './../../home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatChipsModule } from '@angular/material/chips';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatBadgeModule } from '@angular/material';
import { CustomNumberPipe } from './../../pipes/custom-number.pipe';
import { PopupComponent } from '../../pop-up/popup/popup.component';
import { Sub1Component } from '../../academics/sub1/sub1.component';

@NgModule({
  imports: [
    CommonModule,
    AfterLoginRouteModule,
    MaterialModule,
    NgxPaginationModule,
    MatChipsModule,
    ImageCropperModule,
    MatBadgeModule
  ],
  declarations: [    
    HomeComponent,    
    CustomNumberPipe,
    PopupComponent,
    Sub1Component
  ],
  entryComponents: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AfterLoginModule { }
