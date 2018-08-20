/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


import { DOMHighResTimeStamp } from './anim.js';


export class AnimationState {

  /** The current time. */
  time: DOMHighResTimeStamp = 0;

  /** The time elapsed since the last tick. */
  elapsed: number = 0; 

  /** Total time the animation has been running. */
  totalElapsed: number = 0;

  /**
   * Animation progress. Value going from 0 to 1.
   * Only available it the animation has a duration.
   */
  progress: number = 0;

}
