/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


import { DOMHighResTimeStamp } from './anim.js';
import { Animation } from './animation.js';
import { AnimationState } from './animationstate.js';
import { Loop } from './loop.js';


export class Conductor extends Animation {

  private animations: Animation[];
  private loop?: Loop;

  private inTick: boolean = false;

  private postTickQueue: Function[];


  constructor() {
    super();

    this.animations = [];

    this.postTickQueue = [];
  }


  /**
   * @override
   */
  isRunning() {
    if (this.conductor) return this.conductor.isRunning();
    if (this.loop) return this.loop.isRunning();
    return false;
  }


  /**
   * Adds an animation.
   */
  add(animation: Animation) {
    if (this.inTick) {
      this.postTickQueue.push(() => this.add(animation));
      return;
    }

    if (!this.animations.length) {
      this.animations.push(animation);

    } else {
      // Ensure the same animation is not added twice.
      let idx = this.animations.indexOf(animation);
      if (idx != -1) {
        this.animations.splice(idx, 1);
      }
      // Ordered insert by priority.
      idx = 0;
      while (idx < this.animations.length &&
             animation.priority <= this.animations[idx].priority) {
        idx++;
      }
      this.animations.splice(idx, 0, animation);
    }

    this.maybeStart();
  }


  /**
   * Removes an animation.
   */
  remove(animation: Animation) {
    if (this.inTick) {
      this.postTickQueue.push(() => this.remove(animation));
      return;
    }

    let idx = this.animations.indexOf(animation);
    if (idx != -1) {
      this.animations.splice(idx, 1);
    }

    this.maybeStop();
  }


  /**
   * Clears all animations.
   */
  clear() {
    this.animations.slice().forEach((animation) => animation.stop());
    this.stop();
    this.animations.length = 0;
  }


  private activeAnimationsPresent(): boolean {
    let haveActive = false;
    this.animations.forEach((animation) => {
      if (!animation.isPassive()) haveActive = true;
    });
    return haveActive;
  }


  private maybeStart() {
    if (this.activeAnimationsPresent()) {
      this.start();
    }
  }


  private maybeStop() {
    if (!this.activeAnimationsPresent()) {
      this.stop();
    }
  }


  start() {
    if (this.conductor) {
      this.conductor.add(this);

    } else {
      if (!this.loop) {
        this.state.initialized = false;
        this.loop = new Loop((time: DOMHighResTimeStamp) => {
          if (this.state.initialized) {
            this.state.elapsed = time - this.state.time;
          } else {
            this.state.elapsed = 0;
            this.state.initialized = true;
          }
          this.state.time = time;
          this.tick();
        });
      }
      this.loop.start();
    }
  }


  stop() {
    if (this.conductor) {
      this.conductor.remove(this);
    } else {
      this.loop && this.loop.stop();
    }
  }


  tick() {
    this.inTick = true;
    for (var i = 0; i < this.animations.length; i++) {
      var anim = this.animations[i];
      anim.updateAndTick(this.state);
    }
    this.inTick = false;
    if (this.postTickQueue.length) {
      this.postTickQueue.forEach((fn) => fn());
      this.postTickQueue.length = 0;
    }
  }


  /**
   * Disposes this instance.
   */
  dispose() {
    super.dispose();
    this.animations = null;
  }

}
