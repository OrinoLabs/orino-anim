/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
goog.module('orino_anim.loop');
var module = module || { id: 'orino-anim/loop.ts' };
class Loop {
    constructor(callback) {
        this.running = false;
        this.animFrameReqId = 0;
        this.callback = callback;
    }
    tick(time) {
        this.callback(time);
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
exports.Loop = Loop;
