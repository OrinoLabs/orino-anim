/**
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('orino.anim.fps');
goog.provide('orino.anim.fps.Monitor');
goog.provide('orino.anim.fps.View');

goog.require('orino.anim.Animation');


/**
 * @constructor
 * @extends {orino.anim.Animation}
 */
orino.anim.fps.Monitor = function() {
  orino.anim.Animation.call(this);

  /**
   * @type {Array.<number>}
   * @private
   */
  this.timestamps_ = [];
};
orino.anim.fps.Monitor.prototype = Object.create(orino.anim.Animation.prototype);


/** @private @type {number} */
orino.anim.fps.Monitor.prototype.modulus_ = 100;
/** @private @type {number} */
orino.anim.fps.Monitor.prototype.head_ = 0;
/** @private @type {number} */
orino.anim.fps.Monitor.prototype.tail_ = 0;

/** @private */
orino.anim.fps.Monitor.prototype.incHead_ = function() {
  this.head_ = (this.head_ + 1) % this.modulus_;  
};
/** @private */
orino.anim.fps.Monitor.prototype.incTail_ = function() {
  this.tail_ = (this.tail_ + 1) % this.modulus_;
};


/** @inheritDoc */
orino.anim.fps.Monitor.prototype.tick = function(state) {
  this.timestamps_[this.head_] = state.time;
  this.incHead_();
  if (this.head_ == this.tail_) {
    this.incTail_();
  }
};


/**
 * @return {number} The current FPS.
 */
orino.anim.fps.Monitor.prototype.fps = function() {
  var now = orino.anim.now();
  var start = now - 1000;
  while (this.timestamps_[this.tail_] < start && this.tail_ != this.head_) {
    this.incTail_();
  }
  return (this.head_ - this.tail_ + this.modulus_) % this.modulus_;
};


/******************************************************************************/


/**
 * @param {orino.anim.fps.Monitor} monitor
 * @param {Element} elem
 * @param {number=} opt_updateInterval
 * @constructor
 */
orino.anim.fps.View = function(monitor, elem, opt_updateInterval) {
  this.monitor_ = monitor;
  this.elem_ = elem;
  this.updateInterval_ = opt_updateInterval || 300;
  this.start();
};


/**
 * Starts updating.
 */
orino.anim.fps.View.prototype.start = function() {
  this.stop();
  this.intervalId_ = window.setInterval(
      this.update_.bind(this), this.updateInterval_);
};


/**
 * Stops updating.
 */
orino.anim.fps.View.prototype.stop = function() {
  window.clearInterval(this.intervalId_);
};


/**
 * @private
 */
orino.anim.fps.View.prototype.update_ = function() {
  this.elem_.innerHTML = this.monitor_.fps();
};

