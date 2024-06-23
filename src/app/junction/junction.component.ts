import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrafficService } from '../helpers/traffic.service';
import { Subject, takeUntil } from 'rxjs';
import { CROSSING_DURATION, RoadDirection, Roads } from '../helpers/helper';

@Component({
  selector: 'app-junction',
  templateUrl: './junction.component.html',
  styleUrls: ['./junction.component.scss'],
})
export class JunctionComponent implements OnInit, OnDestroy {
  northSouthCars: number[] = [];
  eastWestCars: number[] = [];

  private crossingNorthSouth: boolean = false;
  private crossingEastWest: boolean = false;

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

    this.trafficService
      .getLightState(Roads.NS)
      .pipe(takeUntil(this.destroy$))
      .subscribe((light) => {
        if (light === 'green' && this.northSouthCars.length > 0) {
          this.animateCarCrossing(Roads.NS);
        }
      });

    this.trafficService
      .getLightState(Roads.EW)
      .pipe(takeUntil(this.destroy$))
      .subscribe((light) => {
        if (light === 'green' && this.eastWestCars.length > 0) {
          this.animateCarCrossing(Roads.EW);
        }
      });
  }

  private animateCarCrossing(direction: RoadDirection) {
    if (direction === Roads.NS && this.northSouthCars.length > 0) {
      this.crossingNorthSouth = true;
      this.northSouthCars.pop();

      setTimeout(() => {
        this.crossingNorthSouth = false;
        this.trafficService.carCrossed(Roads.NS);
      }, CROSSING_DURATION);
    } else if (direction === Roads.EW && this.eastWestCars.length > 0) {
      this.crossingEastWest = true;
      this.eastWestCars.pop();

      setTimeout(() => {
        this.crossingEastWest = false;
        this.trafficService.carCrossed(Roads.EW);
      }, CROSSING_DURATION);
    }
  }

  isCarCrossing(direction: RoadDirection) {
    return direction === Roads.NS
      ? this.crossingNorthSouth
      : this.crossingEastWest;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
