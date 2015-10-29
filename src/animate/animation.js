/** 
 * @copyright 2015 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */



goog.provide('animate.Animation');


/**
 * @constructor
 */
animate.Animation = function() {

};


/** 
 * @type {number}
 */
animate.Animation.prototype.priority = 1;


/**
 * @param {number} time
 * @param {number} elapsed
 */
animate.Animation.prototype.tick = function(time, elapsed) {};



