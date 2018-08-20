/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */
export { Animation } from './animation.js';
export { Conductor } from './conductor.js';
export { FpsMonitor } from './fpsmonitor.js';
import { Conductor } from './conductor.js';
let rootConductor;
export function getRootConductor() {
    if (!rootConductor) {
        rootConductor = new Conductor;
    }
    return rootConductor;
}
