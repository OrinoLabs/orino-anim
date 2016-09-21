

goog.provide('orino.anim.Loop');



/**
 * @param {function(DOMHighResTimestamp)} callback
 * @constructor
 */
orino.anim.Loop = function(callback) {

  function tick(time) {
    callback(time);
    scheduleNext();
  }

  var requestId = 0;

  function scheduleNext() {
    requestId = window.requestAnimationFrame(tick);
  }

  function cancel() {
    window.cancelAnimationFrame(requestId)
  }

  var running = false;

  /** Starts the requestAnimationFrame loop. */
  this.start = function() {
    running = true;
    cancel();
    scheduleNext();
  };

  /** Stops the requestAnimationFrame loop. */
  this.stop = function() {
    cancel();
    running = false;
  };

  /** @return {boolean} */
  this.isRunning = function() {
    return running;
  };

};





