import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './../../home/home.component';
import { Sub1Component } from '../../academics/sub1/sub1.component';
import { SchedSetupComponent } from '../../academics/Besogs/sched-setup/sched-setup.component';
import { SectionMaintenanceComponent } from '../../academics/Besogs/section-maintenance/section-maintenance.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, outlet: 'div' },
  { path: 'app-sub1', component: Sub1Component, outlet: 'div' },
  { path: 'sched-setup', component: SchedSetupComponent, outlet: 'div' },
  { path: 'section-maintenance', component: SectionMaintenanceComponent, outlet: 'div' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfterLoginRouteModule { }
