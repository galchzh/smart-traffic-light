import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrafficService } from '../helpers/traffic.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-junction',
  templateUrl: './junction.component.html',
  styleUrls: ['./junction.component.scss'],
})
export class JunctionComponent implements OnInit, OnDestroy {
  northSouthCars: number[] = [];
  eastWestCars: number[] = [];

  private destroy$ = new Subject<void>();

  constructor(private trafficService: TrafficService) {}

  ngOnInit() {
    this.trafficService.northSouthTraffic$
      .pipe(takeUntil(this.destroy$))
      .subscribe((traffic) => {
        this.northSouthCars = Array(traffic).fill(0);
      });

    this.trafficService.eastWestTraffic$
      .pipe(takeUntil(this.destroy$))
      .subscribe((traffic) => {
        this.eastWestCars = Array(traffic).fill(0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
