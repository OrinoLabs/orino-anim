/**
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate.Fps');
goog.provide('animate.Fps.View');

goog.require('animate.Animation');


/**
 * @constructor
 * @extends {animate.Animation}
 */
animate.Fps = function() {
  animate.Animation.call(this);

  /**
   * @type {DOMHighResTimeStamp}
   * @private
   */
  this.timestamps_ = [];
};
goog.inherits(animate.Fps, animate.Animation);


animate.Fps.prototype.modulus_ = 100;
animate.Fps.prototype.head_ = 0;
animate.Fps.prototype.tail_ = 0;


animate.Fps.prototype.incHead_ = function() {
  this.head_ = (this.head_ + 1) % this.modulus_;  
};
animate.Fps.prototype.incTail_ = function() {
  this.tail_ = (this.tail_ + 1) % this.modulus_;
};


/**
 * @inheritDoc
 */
animate.Fps.prototype.tick = function(state) {
  var now = state.time;
  this.timestamps_[this.head_] = now;
  this.incHead_();
  if (this.head_ == this.tail_) {
    this.incTail_();
  }
};


/**
 * @return {number} The fps achieved in the last second.
 */
animate.Fps.prototype.fps = function() {
  var now = animate.now();
  var start = now - 1000;
  while (this.timestamps_[this.tail_] < start && this.tail_ != this.head_) {
    this.incTail_();
  }
  return (this.head_ - this.tail_ + this.modulus_) % this.modulus_;
};


// --------------------------------------------------------------------------


animate.Fps.View = function(mon, elem, opt_updateInterval) {
  this.monitor_ = mon;
  this.elem_ = elem;
  this.updateInterval_ = opt_updateInterval || 300;
  this.start();
};

animate.Fps.View.prototype.start = function() {
  this.stop();
  this.intervalId_ = window.setInterval(this.update_.bind(this), this.updateInterval_);
};

animate.Fps.View.prototype.stop = function() {
  window.clearInterval(this.intervalId_);
};

animate.Fps.View.prototype.update_ = function() {
  this.elem_.innerHTML = this.monitor_.fps();
};




