/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


import { DOMHighResTimeStamp } from './anim.js';


export class Loop {

  /**
   * Static optional function called to determine whether the callback should be
   * invoked in an animation frame.
   * Use case example: With too much going on, Edge Legacy has been observed to
   * not invoke callbacks scheduled with setTimeout anymore. Edge Legacy seems to
   * have some rather bad scheduling problems, especially on single processor systems.
   * In addition to the already mentioned issue with timeouts, output to the
   * console can become extremely laggy too.
   */
  public static shouldTick?: ((time: DOMHighResTimeStamp) => boolean) = undefined;

  private callback: (time: DOMHighResTimeStamp) => void;

  private running: boolean = false;
  private animFrameReqId: number = 0;


  constructor(callback: (time: DOMHighResTimeStamp) => void) {
    this.callback = callback;
  }


  private tick(time: DOMHighResTimeStamp) {
    if (!Loop.shouldTick || Loop.shouldTick(time)) {
      this.callback(time);
    }
    this.scheduleNext();
  }


  private scheduleNext() {
    this.animFrameReqId = window.requestAnimationFrame(this.tick.bind(this));
  }


  private cancel() {
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


  isRunning(): boolean {
    return this.running;
  }

}
