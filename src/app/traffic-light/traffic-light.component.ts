import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RoadDirection } from '../helpers/helper';
import { Subject, takeUntil } from 'rxjs';
import { TrafficService } from '../helpers/traffic.service';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss'],
})
export class TrafficLightComponent implements OnInit, OnDestroy {
  @Input() direction: RoadDirection;

  public currentLight: string;
  private destroy$ = new Subject<void>();

  constructor(private trafficService: TrafficService) {}

  ngOnInit() {
    this.trafficService
      .getLightState(this.direction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((light) => {
        this.currentLight = light;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
