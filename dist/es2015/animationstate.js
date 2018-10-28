/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
export class AnimationState {
    constructor() {
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
