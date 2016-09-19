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
};



/**
 * @param {orino.anim.AnimationOptions=} opt_opts
 * @constructor
 * @implements {goog.Disposable}
 */
orino.anim.Animation = function(opt_opts) {
  var opts = opt_opts || {};

  if (opts.conductor) {
    this.conductor = opts.conductor;
  }
  if (opts.priority) {
    this.priority = opts.priority;
  }

  /**
   * @type {number}
   * @private
   */
  this.duration_ = opts.duration || 0;

  if (opts.tick) {
    this.tick = opts.tick;
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
};
