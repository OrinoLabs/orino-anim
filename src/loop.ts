/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


type DOMHighResTimeStamp = number;


export class Loop {

  private callback: (time: DOMHighResTimeStamp) => void;

  private running: boolean = false;
  private animFrameReqId: number = 0;


  constructor(callback: (time: DOMHighResTimeStamp) => void) {
    this.callback = callback;
  }


  private tick(time: DOMHighResTimeStamp) {
    this.callback(time);
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
