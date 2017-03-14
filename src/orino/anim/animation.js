/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('orino.anim.Animation');

goog.require('orino.anim.AnimationState');


/**
 * @constructor
 */
orino.anim.AnimationOptions = function() {};
orino.anim.AnimationOptions.prototype = {
  /** @type {orino.anim.Conductor} */
  conductor: null,
  /** @type {(number|undefined)} */
  priority: undefined,
  /** @type {(number|undefined)} */
  duration: undefined,
  /** @type {function(orino.anim.AnimationState):void} */
  tick: null,
  /** @type {boolean} */
  passive: false,
  /** @type {boolean} */
  disposeOnStop: false,
  /** @type {Function} */
  dispose: null,
};



/**
 * @param {orino.anim.AnimationOptions=} opt_opts
 * @constructor
 * @implements {goog.Disposable}
 */
orino.anim.Animation = function(opt_opts) {
  /**
   * @type {orino.anim.AnimationOptions}
   * @private
   */
  this.opts_ = opt_opts || {};

  if (this.opts_.conductor) {
    this.conductor = this.opts_.conductor;
  }
  if (this.opts_.priority) {
    this.priority = this.opts_.priority;
  }

  /**
   * @type {number}
   * @private
   */
  this.duration_ = this.opts_.duration || 0;

  /**
   * @type {boolean}
   * @private
   */
  this.passive_ = this.opts_.passive || false;

  if (this.opts_.tick) {
    this.tick = this.opts_.tick;
  }

  /**
   * @type {orino.anim.AnimationState}
   * @protected
   */
  this.state = new orino.anim.AnimationState;
};


/**
 * @type {number}
 */
orino.anim.Animation.DEFAULT_PRIORITY = 1;


/** 
 * @type {number}
 */
orino.anim.Animation.prototype.priority = orino.anim.Animation.DEFAULT_PRIORITY;


/**
 * @type {orino.anim.Conductor}
 * @package
 */
orino.anim.Animation.prototype.conductor;


/**
 * Returns whether this animation is passive.
 * Passive means it does not trigger an animation frame loop to be
 * started when added to a conductor.
 * @return {boolean}
 */
orino.anim.Animation.prototype.isPassive = function() {
  return this.passive_;
};


/**
 * @return {boolean}
 */
orino.anim.Animation.prototype.isRunning = function() {
  return this.conductor && this.conductor.isRunning() || false;
};


/**
 * Starts the animation.
 */
orino.anim.Animation.prototype.start = function() {
  // TODO: Already running?

  this.state.totalElapsed = 0;
  this.state.progress = 0;
  this.state.elapsed = 0;

  if (this.duration_) {
    // Synchronously call tick with progress = 0 to ensure the animation gets
    // a chance to set ifself up. Otherwise whatever is being animated might
    // show up in an unwanted state for a short time (until the next tick).
    this.tick(this.state);
  }

  if (!this.conductor) {
    this.conductor = orino.anim.rootConductor();
  }
  this.conductor.add(this);
};


/**
 * Stops the animation.
 */
orino.anim.Animation.prototype.stop = function() {
  this.conductor && this.conductor.remove(this);
  if (this.opts_.disposeOnStop) {
    this.dispose();
  }
};


/**
 * @param {orino.anim.AnimationState} conductorState
 */
orino.anim.Animation.prototype.tickInternal = function(conductorState) {
  var state = this.state;
  state.time = conductorState.time;
  state.elapsed = conductorState.elapsed;

  state.totalElapsed += state.elapsed;

  if (this.duration_) {
    state.progress = state.totalElapsed / this.duration_;
    if (state.progress > 1) {
      state.progress = 1;
      state.totalElapsed = this.duration_;
    }
  }

  this.tick(state);

  if (state.progress == 1) {
    this.stop();
  }
};


/**
 * @param {orino.anim.AnimationState} state
 */
orino.anim.Animation.prototype.tick = goog.abstractMethod;


/**
 * Disposes this instance.
 */
orino.anim.Animation.prototype.dispose = function() {
  this.tick = null;
  if (this.opts_.dispose) this.opts_.dispose();
};
