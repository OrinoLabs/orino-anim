/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
export class Loop {
    constructor(callback) {
        this.running = false;
        this.animFrameReqId = 0;
        this.callback = callback;
    }
    tick(time) {
        if (!Loop.shouldTick || Loop.shouldTick(time)) {
            this.callback(time);
        }
        this.scheduleNext();
    }
    scheduleNext() {
        this.animFrameReqId = window.requestAnimationFrame(this.tick.bind(this));
    }
    cancel() {
        window.cancelAnimationFrame(this.animFrameReqId);
    }
    /** Starts the requestAnimationFrame loop. */
    start() {
        this.running = true;
        this.cancel();
        this.scheduleNext();
    }
    /** Stops the requestAnimationFrame loop. */
    stop() {
        this.cancel();
        this.running = false;
    }
    isRunning() {
        return this.running;
    }
}
/**
 * Static optional function called to determine whether the callback should be
 * invoked in an animation frame.
 * Use case example: With too much going on, Edge Legacy has been observed to
 * not invoke callbacks scheduled with setTimeout anymore. Edge Legacy seems to
 * have some rather bad scheduling problems, especially on single processor systems.
 * In addition to the already mentioned issue with timeouts, output to the
 * console can become extremely laggy too.
 */
Loop.shouldTick = undefined;
