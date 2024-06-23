import { Injectable } from '@angular/core';
import { RoadDirection, Roads } from './helper';
import { BehaviorSubject } from 'rxjs';

const MIN_ARRIVAL_TIME = 10000; // 10 seconds in ms
const MAX_ARRIVAL_TIME = 30000; // 30 seconds in ms

@Injectable({
  providedIn: 'root',
})
export class TrafficService {
  private northSouthTraffic = new BehaviorSubject<number>(0);
  private eastWestTraffic = new BehaviorSubject<number>(0);

  northSouthTraffic$ = this.northSouthTraffic.asObservable();
  eastWestTraffic$ = this.eastWestTraffic.asObservable();

  constructor() {
    this.simulateTraffic(Roads.NS);
    this.simulateTraffic(Roads.EW);
  }

  private getRandomInterval(): number {
    // Every 10 to 30 seconds, cars arrive along each road
    return (
      Math.floor(Math.random() * (MAX_ARRIVAL_TIME - MIN_ARRIVAL_TIME + 1)) +
      MIN_ARRIVAL_TIME
    );
  }

  private simulateTraffic(road: RoadDirection) {
    const interval = this.getRandomInterval();
    console.log({ road, interval });

    setTimeout(() => {
      if (road === Roads.NS) {
        this.northSouthTraffic.next(this.northSouthTraffic.value + 1);
      } else {
        this.eastWestTraffic.next(this.eastWestTraffic.value + 1);
      }
      this.simulateTraffic(road);
    }, interval);
  }
}
