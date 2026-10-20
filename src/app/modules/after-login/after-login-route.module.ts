import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './../../home/home.component';
import { Sub1Component } from '../../academics/sub1/sub1.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, outlet: 'div' },
  { path: 'app-sub1', component: Sub1Component, outlet: 'div' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfterLoginRouteModule { }
