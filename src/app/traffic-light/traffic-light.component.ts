import { Component, Input } from '@angular/core';
import { RoadDirection } from '../helpers/helper';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss'],
})
export class TrafficLightComponent {
  @Input() direction: RoadDirection;

  constructor() {}
}
