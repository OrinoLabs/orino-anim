/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
goog.module('orino_anim.animationstate');
var module = module || { id: 'orino-anim/animationstate.ts' };
class AnimationState {
    constructor() {
        /** Whether time has been initialized */
        this.initialized = false;
        /** The current time. */
        this.time = 0;
        /** The time elapsed since the last tick. */
        this.elapsed = 0;
        /** Total time the animation has been running. */
        this.totalElapsed = 0;
        /**
         * Animation progress. Value going from 0 to 1.
         * Only available it the animation has a duration.
         */
        this.progress = 0;
    }
}
exports.AnimationState = AnimationState;
