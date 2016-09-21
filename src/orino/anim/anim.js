/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('orino.anim');

goog.require('orino.anim.Conductor');



/**
 * @type {animate.Conductor}
 * @private
 */
orino.anim.rootConductor_;


/**
 * @return {animate.Conductor}
 */
orino.anim.rootConductor = function() {
  if (!orino.anim.rootConductor_) {
    orino.anim.rootConductor_ = new orino.anim.Conductor;
  }

  return orino.anim.rootConductor_;
};


/**
 * The offset between a traditional timestamp (as returned by Date.now()) and
 * DOMHighResTimestamp.
 * @type {number}
 * @private
 */
orino.anim.timeOffset_ = 0;
window.requestAnimationFrame(function(time) {
  orino.anim.timeOffset_ = Date.now() - time;
});


/**
 * @return {DOMHighResTimeStamp}
 */
orino.anim.now = function() {
  // NOTE: Might be behind the actual current time (by less than 1ms) due to
  // precision difference.
  return Date.now() - orino.anim.timeOffset_;
};


/**
 * @return {DOMHighResTimeStamp}
 * @deprecated
 */
orino.anim.currentTime = orino.anim.now;

