/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
export { Animation } from './animation.js';
export { Conductor } from './conductor.js';
export { FpsMonitor } from './fpsmonitor.js';
// HACK: Provide Animation class with the root conductor.
// This avoids a cyclic dependency issue occuring in ES6 and tsickle/closure-compiler
// environments, which can't have cyclic load-time dependencies.
import { Animation } from './animation.js';
import { Conductor } from './conductor.js';
Animation.rootConductor = new Conductor;
