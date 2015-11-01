/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate.Conductor');


/**
 * @constructor
 * @extends {animate.Animation}
 * @implements {goog.Disposable}
 */
animate.Conductor = function() {
  /** 
   * @type {Array.<animate.Animation>}
   * @private
   */
  this.animations_ = []
};
animate.Conductor.prototype = Object.create(animate.Animation.prototype);


/**
 * @type {DOMHighResTimeStamp}
 * @private
 */
animate.Conductor.prototype.time_ = 0;


animate.Conductor.prototype.animFrameId_;


/**
 * @return {number}
 */
animate.Conductor.prototype.time = function() {
  return this.time_;
};


/**
 * @param {!animate.Animation} animation
 */
animate.Conductor.prototype.add = function(animation) {
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
 * @param {animate.Animation} animation
 */
animate.Conductor.prototype.remove = function(animation) {
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
  this.animations_.length = 0;
  this.stop_();
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
  this.boundTick_ || (this.boundTick_ = this.tick_.bind(this));
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
  var elapsed = time - this.time_;
  this.tick(time, elapsed);
  if (this.animations_.length) {
    this.scheduleTick_();
  }
};


/**
 * @param {DOMHighResTimeStamp=} time
 * @parma {number} elapsed
 */
animate.Conductor.prototype.tick = function(time, elapsed) {
  for (var i = 0, I = this.animations_.length; i < I; i++) {
    var anim = this.animations_[i];
    anim.tick(time, elapsed);
  }  
};


/**
 * Disposes this instance.
 */
animate.Conductor.prototype.dispose = function() {
  this.stop_();
  animate.Animation.prototype.dispose.call(this);
  this.animations_ = null;
};







