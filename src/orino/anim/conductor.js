/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('orino.anim.Conductor');

goog.require('orino.anim.Animation');
goog.require('orino.anim.Loop');



/**
 * @constructor
 * @extends {orino.anim.Animation}
 * @implements {goog.Disposable}
 */
orino.anim.Conductor = function() {
  orino.anim.Animation.call(this);

  /** 
   * @type {Array.<orino.anim.Animation>}
   * @private
   */
  this.animations_ = [];

  this.afterCurrentTickCallbacks_ = []
};
orino.anim.Conductor.prototype = Object.create(orino.anim.Animation.prototype);


/**
 * @type {orino.anim.Loop}
 * @private
 */
orino.anim.Conductor.prototype.loop_ = null;


/**
 * @type {boolean}
 * @private
 */
orino.anim.Conductor.prototype.inTick_ = false;


/**
 * @return {boolean}
 */
orino.anim.Conductor.prototype.isRunning = function() {
  if (this.conductor) return this.conductor.isRunning();
  if (this.loop_) return this.loop_.isRunning();
  return false;
};


/**
 * @param {Function} fn
 * @private
 */
orino.anim.Conductor.prototype.afterCurrentTick_ = function(fn) {
  this.afterCurrentTickCallbacks_.push(fn);
};


/**
 * @param {!orino.anim.Animation} animation
 */
orino.anim.Conductor.prototype.add = function(animation) {
  if (this.inTick_) {
    this.afterCurrentTick_(this.add.bind(this, animation));
    return;
  }

  if (!this.animations_.length) {
    this.animations_.push(animation);

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

  this.maybeStart_();
};


/**
 * @param {orino.anim.Animation} animation
 */
orino.anim.Conductor.prototype.remove = function(animation) {
  if (this.inTick_) {
    this.afterCurrentTick_(this.remove.bind(this, animation));
    return;
  }

  var idx = this.animations_.indexOf(animation);
  if (idx != -1) {
    this.animations_.splice(idx, 1);
  }

  this.maybeStop_();
};


/**
 * Clears all animations.
 */
orino.anim.Conductor.prototype.clear = function() {
  this.stop();
  this.animations_.length = 0;
};


/**
 * @return {boolean}
 * @private
 */
orino.anim.Conductor.prototype.activeAnimationsPresent_ = function() {
  var haveActive = false;
  this.animations_.forEach(function(animation) {
    if (!animation.isPassive()) haveActive = true;
  });
  return haveActive;
};


/**
 * @private
 */
orino.anim.Conductor.prototype.maybeStart_ = function() {
  if (this.activeAnimationsPresent_()) {
    this.start();
  }
};


/**
 * @private
 */
orino.anim.Conductor.prototype.maybeStop_ = function() {
  if (!this.activeAnimationsPresent_()) {
    this.stop();
  }
};


/**
 * @inheritDoc
 */
orino.anim.Conductor.prototype.start = function() {
  if (this.conductor) {
    this.conductor.add(this);

  } else {
    if (!this.loop_) {
      this.loop_ = new orino.anim.Loop(this.tick_.bind(this))
    }
    this.loop_.start();
  }
};


/**
 * @inheritDoc
 */
orino.anim.Conductor.prototype.stop = function() {
  if (this.conductor) {
    this.conductor.remove(this);
  } else {
    this.loop_ && this.loop_.stop();
  }
};


/**
 * @param {DOMHighResTimestamp} time
 * @private
 */
orino.anim.Conductor.prototype.tick_ = function(time) {
  this.state.elapsed = time - this.state.time;
  this.state.time = time;

  this.tickInternal(this.state);
};


/**
 * @param {orino.anim.AnimationState} state
 */
orino.anim.Conductor.prototype.tickInternal = function(state) {
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
orino.anim.Conductor.prototype.dispose = function() {
  this.clearScheduledTick_();
  orino.anim.Animation.prototype.dispose.call(this);
  this.animations_ = null;
};







