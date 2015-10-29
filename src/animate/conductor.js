/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate.Conductor');


/**
 * @constructor
 */
animate.Conductor = function() {
  /** 
   * @type {Array.<animate.Animation>}
   * @private
   */
  this.animations_ = []
};


/**
 * @type {DOMHighResTimeStamp}
 * @private
 */
animate.Conductor.prototype.time_ = 0;


/**
 * @return {number}
 */
animate.Conductor.prototype.time = function() {
  return this.time_;
};


/**
 * @param {!animate.Animation} animation
 * @parma {number=} opt_priority
 */
animate.Conductor.prototype.add = function(animation, opt_priority) {
  if (opt_priority) {
    animation.priority = opt_priority;
  }
  if (!this.animations_.length) {
    this.animations_.push(animation);
    this.maybeStart_();

  } else {
    for (var idx = 0; animation.priority < this.animations_[idx].priority; idx++) {}
    this.animations_.splice(idx, 0, animation);
  }
};


/**
 * @param {animate.Animation} animation
 */
animate.Conductor.prototype.remove = function(animation) {
  var idx = this.animations_.indexOf(animation);
  if (idx != -1) {
    this.animations.splice(idx, 1);
  }
  if (!this.animations_.length) {
    this.stop_();
  }
};


/**
 * @private
 */
animate.Conductor.prototype.maybeStart_ = function() {
  this.boundTick_ || (this.boundTick_ = this.tick_.bind(this));
  this.animFrameId_ = window.requestAnimationFrame(this.boundTick_);
};


/**
 * @private
 */
animate.Conductor.prototype.stop_ = function() {
  window.cancelAnimationFrame(this.animFrameId_);
};


/**
 * @param {DOMHighResTimestamp} time
 * @private
 */
animate.Conductor.prototype.tick_ = function(time) {
  var elapsed = time - this.time_;
  this.tick(time, elapsed);
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







