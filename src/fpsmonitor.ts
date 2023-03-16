/**
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


import { Animation } from './animation.js';
import { AnimationState } from './animationstate.js';


export class FpsMonitor extends Animation {

  private timestamps: number[] = [];

  private size: number = 120;

  private head: number = 0;
  private tail: number = 0;

  private update: (number) => void;
  private updateInterval: number;
  private lastUpdate: number = -Infinity;


  constructor(update: (number) => void, updateInterval: number = 400) {
    super();
    this.update = update;
    this.updateInterval = updateInterval;
  }


  private incHead() {
    this.head = (this.head + 1) % this.size;  
  }


  private incTail() {
    this.tail = (this.tail + 1) % this.size;
  }


  override tick() {
    this.timestamps[this.head] = this.state.time;
    this.incHead();
    if (this.head == this.tail) {
      this.incTail();
    }

    if (this.state.time - this.lastUpdate > this.updateInterval) {
      this.lastUpdate = this.state.time;
      this.update(this.fps());
    }
  }


  /**
   * Returns the current FPS.
   */
  fps(): number {
    let now = performance.now();
    let start = now - 1000;
    while (this.timestamps[this.tail] < start && this.tail != this.head) {
      this.incTail();
    }
    return (this.head - this.tail + this.size) % this.size;
  }

}
