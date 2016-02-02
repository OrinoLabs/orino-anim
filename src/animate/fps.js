/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate.fps');
goog.provide('animate.fps.Monitor');
goog.provide('animate.fps.View');

goog.require('animate.Animation');



/**
 * @constructor
 * @extends {animate.Animation}
 */
animate.fps.Monitor = function() {
  animate.Animation.call(this);

  /**
   * @type {Array.<number>}
   * @private
   */
  this.timestamps_ = [];
};
animate.fps.Monitor.prototype = Object.create(animate.Animation.prototype);


/** @private @type {number} */
animate.fps.Monitor.prototype.modulus_ = 100;
/** @private @type {number} */
animate.fps.Monitor.prototype.head_ = 0;
/** @private @type {number} */
animate.fps.Monitor.prototype.tail_ = 0;

/** @private */
animate.fps.Monitor.prototype.incHead_ = function() {
  this.head_ = (this.head_ + 1) % this.modulus_;  
};
/** @private */
animate.fps.Monitor.prototype.incTail_ = function() {
  this.tail_ = (this.tail_ + 1) % this.modulus_;
};


/** @inheritDoc */
animate.fps.Monitor.prototype.tick = function(state) {
  this.timestamps_[this.head_] = state.time;
  this.incHead_();
  if (this.head_ == this.tail_) {
    this.incTail_();
  }
};


/**
 * @return {number} The current FPS.
 */
animate.fps.Monitor.prototype.fps = function() {
  var now = animate.now();
  var start = now - 1000;
  while (this.timestamps_[this.tail_] < start && this.tail_ != this.head_) {
    this.incTail_();
  }
  return (this.head_ - this.tail_ + this.modulus_) % this.modulus_;
};


/******************************************************************************/


/**
 * @param {animate.fps.Monitor} monitor
 * @param {Element} elem
 * @param {number=} opt_updateInterval
 * @constructor
 */
animate.fps.View = function(monitor, elem, opt_updateInterval) {
  this.monitor_ = monitor;
  this.elem_ = elem;
  this.updateInterval_ = opt_updateInterval || 300;
  this.start();
};


/**
 * Starts updating.
 */
animate.fps.View.prototype.start = function() {
  this.stop();
  this.intervalId_ = window.setInterval(
      this.update_.bind(this), this.updateInterval_);
};


/**
 * Stops updating.
 */
animate.fps.View.prototype.stop = function() {
  window.clearInterval(this.intervalId_);
};


/**
 * @private
 */
animate.fps.View.prototype.update_ = function() {
  this.elem_.innerHTML = this.monitor_.fps();
};

