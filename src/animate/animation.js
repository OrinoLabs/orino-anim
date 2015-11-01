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
 * @type {animate.Conductor}
 * @package
 */
animate.Animation.prototype.conductor;


/**
 * @param {animate.Conductor} conductor
 */
animate.Animation.prototype.setConductor = function(conductor) {
  this.conductor = conductor;
};


/**
 * Starts the animation.
 */
animate.Animation.prototype.start = function() {
  if (!this.conductor) {
    this.conductor = animate.rootConductor();
  }
  this.conductor.add(this);
};


/**
 * Stops the animation.
 */
animate.Animation.prototype.stop = function() {
  this.conductor && this.conductor.remove(this);
};


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
