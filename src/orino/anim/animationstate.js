/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


goog.provide('orino.anim.AnimationState');



orino.anim.AnimationState = function() {};


/**
 * @type {DOMHighResTimeStamp}
 */
orino.anim.AnimationState.prototype.time = 0;


/**
 * The time elapsed since the last tick.
 * @type {number}
 */
orino.anim.AnimationState.prototype.elapsed = 0;


/**
 * Total time the animation has been running.
 * @type {number}
 */
orino.anim.AnimationState.prototype.totalElapsed = 0;


/**
 * @type {number}
 */
orino.anim.AnimationState.prototype.progress = 0;
