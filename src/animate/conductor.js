/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate.Conductor');

goog.require('animate.Animation');



/**
 * @constructor
 * @extends {animate.Animation}
 * @implements {goog.Disposable}
 */
animate.Conductor = function() {
  animate.Animation.call(this);

  /** 
   * @type {Array.<animate.Animation>}
   * @private
   */
  this.animations_ = [];


  this.afterCurrentTickCallbacks_ = []
};
animate.Conductor.prototype = Object.create(animate.Animation.prototype);


/** 
 * @type {number}
 * @private
 */
animate.Conductor.prototype.animFrameId_ = 0;


/**
 * @type {boolean}
 * @private
 */
animate.Conductor.prototype.inTick_ = false;


/**
 * @param {Function} fn
 * @private
 */
animate.Conductor.prototype.afterCurrentTick_ = function(fn) {
  this.afterCurrentTickCallbacks_.push(fn);
};


/**
 * @param {!animate.Animation} animation
 */
animate.Conductor.prototype.add = function(animation) {
  if (this.inTick_) {
    this.afterCurrentTick_(this.add.bind(this, animation));
    return;
  }

  if (!this.animations_.length) {
    this.animations_.push(animation);
    this.maybeStart_();

  } else {
    // Ensure the same animation is not added twice.
    var idx = this.animations_.indexOf(animation);
    if (idx != -1) {
      this.animations_.splice(idx, 1);
    }
    // Ordered insert by priority.
    for (var idx = 0, I = this.animations_.length;
         idx < I && animation.priority <= this.animations_[idx].priority;
         idx++) {}
    this.animations_.splice(idx, 0, animation);
  }
};


/**
 * @param {animate.Animation} animation
 */
animate.Conductor.prototype.remove = function(animation) {
  if (this.inTick_) {
    this.afterCurrentTick_(this.remove.bind(this, animation));
    return;
  }

  var idx = this.animations_.indexOf(animation);
  if (idx != -1) {
    this.animations_.splice(idx, 1);
  }
  if (!this.animations_.length) {
    this.stop();
  }
};


/**
 * Clears all animations.
 */
animate.Conductor.prototype.clear = function() {
  console.log('clear')
  this.stop();
  this.animations_.length = 0;
};


/**
 * @private
 */
animate.Conductor.prototype.maybeStart_ = function() {
  this.start();
};


/**
 * @inheritDoc
 */
animate.Conductor.prototype.start = function() {
  if (this.conductor) {
    this.conductor.add(this);
  } else {
    this.state.time = animate.currentTime();
    this.boundTick_ || (this.boundTick_ = this.tick_.bind(this));
    this.clearScheduledTick_();
    this.scheduleTick_();
  }
};


/**
 * @inheritDoc
 */
animate.Conductor.prototype.stop = function() {
  if (this.conductor) {
    this.conductor.remove(this);
  } else {
    this.clearScheduledTick_();
  }
};


/**
 * @private
 */
animate.Conductor.prototype.scheduleTick_ = function() {
  this.animFrameId_ = window.requestAnimationFrame(this.boundTick_);
};


/**
 * @private
 */
animate.Conductor.prototype.clearScheduledTick_ = function() {
  window.cancelAnimationFrame(this.animFrameId_);
};


/**
 * @param {DOMHighResTimestamp} time
 * @private
 */
animate.Conductor.prototype.tick_ = function(time) {
  this.state.elapsed = time - this.state.time;
  this.state.time = time;

  this.tickInternal(this.state);

  if (this.animations_.length) {
    this.scheduleTick_();
  }
};


/**
 * @param {animate.AnimationState} state
 */
animate.Conductor.prototype.tickInternal = function(state) {
  this.inTick_ = true;
  for (var i = 0, I = this.animations_.length; i < I; i++) {
    var anim = this.animations_[i];
    anim.tickInternal(state);
  }
  this.inTick_ = false;
  if (this.afterCurrentTickCallbacks_.length) {
    this.afterCurrentTickCallbacks_.forEach(function(fn) { fn() });
    this.afterCurrentTickCallbacks_.length = 0;
  }
};


/**
 * Disposes this instance.
 */
animate.Conductor.prototype.dispose = function() {
  this.clearScheduledTick_();
  animate.Animation.prototype.dispose.call(this);
  this.animations_ = null;
};







