/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate');

goog.require('animate.Conductor');



/**
 * @type {animate.Conductor}
 * @private
 */
animate.rootConductor_;


/**
 * @return {animate.Conductor}
 */
animate.rootConductor = function() {
  if (!animate.rootConductor_) {
    animate.rootConductor_ = new animate.Conductor;
  }

  return animate.rootConductor_;
};


/**
 * The offset between a traditional timestamp (as returned by Date.now()) and
 * DOMHighResTimestamp.
 * @type {number}
 * @protected
 */
animate.timeOffset_ = 0;
window.requestAnimationFrame(function(time) {
  animate.timeOffset_ = Date.now() - time;
})


/**
 * @return {DOMHighResTimeStamp}
 */
animate.currentTime = function() {
  // NOTE: Might be behind the actual current time (by less than 1ms) due to
  // precision difference.
  return Date.now() - animate.timeOffset_;
};
