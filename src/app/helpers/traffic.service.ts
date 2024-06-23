import { Injectable } from '@angular/core';
import { CROSSING_DURATION, RoadDirection, Roads } from './helper';
import { BehaviorSubject } from 'rxjs';

const enum TrafficLightOptions {
  RED = 'red',
  GREEN = 'green',
}

const MIN_ARRIVAL_TIME = 10000; // 10 seconds in ms
const MAX_ARRIVAL_TIME = 30000; // 30 seconds in ms

@Injectable({
  providedIn: 'root',
})
export class TrafficService {
  private northSouthTraffic = new BehaviorSubject<number>(0);
  private eastWestTraffic = new BehaviorSubject<number>(0);

  private northSouthLight = new BehaviorSubject<string>(
    TrafficLightOptions.RED
  );
  private eastWestLight = new BehaviorSubject<string>(TrafficLightOptions.RED);

  northSouthTraffic$ = this.northSouthTraffic.asObservable();
  eastWestTraffic$ = this.eastWestTraffic.asObservable();

  northSouthLight$ = this.northSouthLight.asObservable();
  eastWestLight$ = this.eastWestLight.asObservable();

  constructor() {
    this.simulateTraffic(Roads.NS);
    this.simulateTraffic(Roads.EW);
    this.controlTrafficLight();
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

  private controlTrafficLight() {
    const nsTraffic = this.northSouthTraffic.value;
    const ewTraffic = this.eastWestTraffic.value;

    if (nsTraffic > 0) {
      // North-South green light
      this.northSouthLight.next(TrafficLightOptions.GREEN);
      this.eastWestLight.next(TrafficLightOptions.RED);
      this.clearTraffic(Roads.NS, Math.min(30, nsTraffic * 2));
    } else if (ewTraffic > 0) {
      // East-West green light
      this.northSouthLight.next(TrafficLightOptions.RED);
      this.eastWestLight.next(TrafficLightOptions.GREEN);
      this.clearTraffic(Roads.EW, Math.min(30, ewTraffic * 2));
    }

    setTimeout(() => {
      this.controlTrafficLight();
    }, Math.min(30000, Math.max(nsTraffic, ewTraffic) * 2000));
  }

  private clearTraffic(direction: RoadDirection, duration: number) {
    let interval = setInterval(() => {
      if (direction === Roads.NS && this.northSouthTraffic.value > 0) {
        this.northSouthTraffic.next(this.northSouthTraffic.value - 1);
      } else if (direction === Roads.EW && this.eastWestTraffic.value > 0) {
        this.eastWestTraffic.next(this.eastWestTraffic.value - 1);
      }
    }, CROSSING_DURATION); // It takes each car 2 seconds to cross the junction when the green light is on
    setTimeout(() => clearInterval(interval), duration * 1000);
  }

  getLightState(direction: RoadDirection) {
    return direction === Roads.NS ? this.northSouthLight$ : this.eastWestLight$;
  }

  carCrossed(direction: RoadDirection) {
    if (direction === Roads.NS) {
      this.northSouthTraffic.next(this.northSouthTraffic.value - 1);
    } else {
      this.eastWestTraffic.next(this.eastWestTraffic.value - 1);
    }
  }
}
