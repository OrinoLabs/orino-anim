/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
goog.module('orino_anim.anim');
var module = module || { id: 'orino-anim/anim.ts' };
var animation_js_1 = goog.require('orino_anim.animation');
exports.Animation = animation_js_1.Animation;
var animationstate_js_1 = goog.require('orino_anim.animationstate');
exports.AnimationState = animationstate_js_1.AnimationState;
var conductor_js_1 = goog.require('orino_anim.conductor');
exports.Conductor = conductor_js_1.Conductor;
var loop_js_1 = goog.require('orino_anim.loop');
exports.Loop = loop_js_1.Loop;
var fpsmonitor_js_1 = goog.require('orino_anim.fpsmonitor');
exports.FpsMonitor = fpsmonitor_js_1.FpsMonitor;
// HACK: Provide Animation class with the root conductor.
// This avoids a cyclic dependency issue occuring in ES6 and tsickle/closure-compiler
// environments, which can't have cyclic load-time dependencies.
var animation_js_2 = animation_js_1;
var conductor_js_2 = conductor_js_1;
animation_js_2.Animation.rootConductor = new conductor_js_2.Conductor;
