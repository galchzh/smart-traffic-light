import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { JunctionComponent } from './junction/junction.component';
import { TrafficLightComponent } from './traffic-light/traffic-light.component';

const routes: Routes = [
  {
    path: 'junction',
    component: JunctionComponent,
  },
  { path: '', redirectTo: 'junction', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent, JunctionComponent, TrafficLightComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
