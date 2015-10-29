/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */



goog.provide('animate.Animation');


/**
 * @constructor
 * @implements {goog.Disposable}
 */
animate.Animation = function() {

};


/**
 * @type {number}
 */
animate.Animation.DEFAULT_PRIORITY = 1;


/** 
 * @type {number}
 */
animate.Animation.prototype.priority = animate.Animation.DEFAULT_PRIORITY;


/**
 * @param {number} time
 * @param {number} elapsed
 */
animate.Animation.prototype.tick = goog.abstractMethod;


/**
 * Disposes this instance.
 */
animate.Animation.prototype.dispose = function() {
  this.tick = null;
};
