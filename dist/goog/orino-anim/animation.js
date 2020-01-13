/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
goog.module('orino_anim.animation');
var module = module || { id: 'orino-anim/animation.ts' };
// HACK: Using .js suffix for import paths.
// These files do not actually exist, but tsc will still find the corresponding
// typescript files.
// This gets tsc to emit working ES6 imports (which include the suffix).
// With the 'proper' TS way (omitting the suffix), the emitted ES6 modules won't
// have the suffix either.
// https://github.com/Microsoft/TypeScript/issues/16577
// https://github.com/Microsoft/TypeScript/issues/25959
var animationstate_js_1 = goog.require('orino_anim.animationstate');
class Animation {
    constructor(opts) {
        this.opts = opts || ({});
        this.conductor = this.opts.conductor || undefined;
        this.priority = this.opts.priority || Animation.DEFAULT_PRIORITY;
        this.duration = this.opts.duration || undefined;
        this.passive = this.opts.passive || false;
        this.state = new animationstate_js_1.AnimationState;
    }
    ;
    /**
     * Returns whether this animation is passive.
     * Passive means it does not trigger an animation frame loop to be
     * started when added to a conductor.
     */
    isPassive() {
        return this.passive;
    }
    /**
     * Whether the animation is running.
     */
    isRunning() {
        return this.conductor && this.conductor.isRunning() || false;
    }
    /**
     * Starts the animation.
     */
    start() {
        // TODO: Already running?
        this.state.totalElapsed = 0;
        this.state.progress = 0;
        this.state.elapsed = 0;
        if (this.duration) {
            // Synchronously call tick with progress = 0 to ensure the animation gets
            // a chance to set ifself up. Otherwise whatever is being animated might
            // show up in an unwanted state for a short time (until the next tick).
            this.tick();
        }
        if (!this.conductor) {
            this.conductor = Animation.rootConductor; //getRootConductor();
        }
        this.conductor.add(this);
    }
    /**
     * Stops the animation.
     */
    stop() {
        this.conductor && this.conductor.remove(this);
        if (this.opts.disposeOnStop) {
            this.dispose();
        }
    }
    updateAndTick(conductorState) {
        this.state.time = conductorState.time;
        this.state.elapsed = conductorState.elapsed;
        this.state.totalElapsed += this.state.elapsed;
        if (this.duration) {
            this.state.progress = this.state.totalElapsed / this.duration;
            if (this.state.progress > 1) {
                this.state.progress = 1;
                this.state.totalElapsed = this.duration;
            }
        }
        this.tick();
        if (this.state.progress == 1) {
            this.stop();
        }
    }
    tick() {
        if (this.opts.tick) {
            this.opts.tick(this.state);
        }
    }
    /**
     * Disposes this instance.
     */
    dispose() {
        if (this.opts.dispose)
            this.opts.dispose();
    }
}
Animation.DEFAULT_PRIORITY = 1;
exports.Animation = Animation;
