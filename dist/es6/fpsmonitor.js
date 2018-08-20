/**
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
import { Animation } from './animation.js';
export class FpsMonitor extends Animation {
    constructor(update, updateInterval = 400) {
        super();
        this.timestamps = [];
        this.size = 120;
        this.head = 0;
        this.tail = 0;
        this.lastUpdate = -Infinity;
        this.update = update;
        this.updateInterval = updateInterval;
    }
    incHead() {
        this.head = (this.head + 1) % this.size;
    }
    incTail() {
        this.tail = (this.tail + 1) % this.size;
    }
    tick() {
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
    fps() {
        let now = performance.now();
        let start = now - 1000;
        while (this.timestamps[this.tail] < start && this.tail != this.head) {
            this.incTail();
        }
        return (this.head - this.tail + this.size) % this.size;
    }
}
