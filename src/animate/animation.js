/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate.Animation');

goog.require('animate.AnimationState');


/**
 * @constructor
 * @implements {goog.Disposable}
 */
animate.Animation = function(opt_duration) {
  /**
   * @type {number}
   * @private
   */
  this.duration_ = opt_duration || 0;

  /**
   * @type {animate.AnimationState}
   * @protected
   */
  this.state = new animate.AnimationState;
};


/**
 * @type {number}
 */
animate.Animation.DEFAULT_PRIORITY = 1;


/** 
 * @type {number}
 */
animate.Animation.prototype.priority = animate.Animation.DEFAULT_PRIORITY;


/**
 * @type {animate.Conductor}
 * @package
 */
animate.Animation.prototype.conductor;


/**
 * @param {animate.Conductor} conductor
 */
animate.Animation.prototype.setConductor = function(conductor) {
  this.conductor = conductor;
};


/**
 * Starts the animation.
 */
animate.Animation.prototype.start = function() {
  // TODO: Already running?

  this.state.totalElapsed = 0;

  if (!this.conductor) {
    this.conductor = animate.rootConductor();
  }
  this.conductor.add(this);
};


/**
 * Stops the animation.
 */
animate.Animation.prototype.stop = function() {
  this.conductor && this.conductor.remove(this);
};


/**
 * @param {animate.AnimationState} conductorState
 */
animate.Animation.prototype.tickInternal = function(conductorState) {
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
 * @param {animate.AnimationState} state
 */
animate.Animation.prototype.tick = goog.abstractMethod;


/**
 * Disposes this instance.
 */
animate.Animation.prototype.dispose = function() {
  this.tick = null;
};
