

goog.provide('animate.Fps');
goog.provide('fpsmon.Display');


animate.Fps = function() {
  this.timestamps_ = [];
};

animate.Fps.prototype.modulus_ = 100;
animate.Fps.prototype.head_ = 0;
animate.Fps.prototype.tail_ = 0;


animate.Fps.prototype.incHead_ = function() {
  this.head_ = (this.head_ + 1) % this.modulus_;  
};
animate.Fps.prototype.incTail_ = function() {
  this.tail_ = (this.tail_ + 1) % this.modulus_;
};


animate.Fps.prototype.tick = function() {
  var now = Date.now();
  this.timestamps_[this.head_] = now;
  this.incHead_();
  if (this.head_ == this.tail_) {
    this.incTail_();
  }
};


animate.Fps.prototype.fps = function() {
  var now = Date.now();
  var start = now - 1000;
  while (this.timestamps_[this.tail_] < start && this.tail_ != this.head_) {
    this.incTail_();
  }
  return (this.head_ - this.tail_ + this.modulus_) % this.modulus_;
};


// --------------------------------------------------------------------------


fpsmon.Display = function(mon, elem, opt_updateInterval) {
  this.monitor_ = mon;
  this.elem_ = elem;
  this.updateInterval_ = opt_updateInterval || 300;
  this.start();
};

fpsmon.Display.prototype.start = function() {
  this.stop();
  this.intervalId_ = window.setInterval(this.update_.bind(this), this.updateInterval_);
};

fpsmon.Display.prototype.stop = function() {
  window.clearInterval(this.intervalId_);
};

fpsmon.Display.prototype.update_ = function() {
  this.elem_.innerHTML = this.monitor_.fps();
};




