export type RoadDirection = 'north-south' | 'east-west';

export enum Roads {
  NS = 'north-south',
  EW = 'east-west',
}

export const CROSSING_DURATION = 2000; // 2 seconds in ms

export const enum TrafficLightOptions {
  RED = 'red',
  GREEN = 'green',
}

export const MIN_ARRIVAL_TIME = 10000; // 10 seconds in ms
export const MAX_ARRIVAL_TIME = 30000; // 30 seconds in ms
