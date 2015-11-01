/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('animate.AnimationState');



animate.AnimationState = function() {};


/**
 * @type {DOMHighResTimeStamp}
 */
animate.AnimationState.prototype.time = 0;


/**
 * The time elapsed since the last tick.
 * @type {number}
 */
animate.AnimationState.prototype.elapsed = 0;
