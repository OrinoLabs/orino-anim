/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


export { Animation } from './animation.js';
export { Conductor } from './conductor.js';
export { FpsMonitor } from './fpsmonitor.js';

import { Conductor } from './conductor.js';


// TS doesn't declare DOMHighResTimeStamp by default, therefore declaring it here.
// It seems the web animations definition file is still work in progress.
// See https://gist.github.com/kritollm/bdaa485cf81bbde304b618b7b7d5e2ea
export type DOMHighResTimeStamp = number;


let rootConductor: Conductor;


export function getRootConductor(): Conductor {
  if (!rootConductor) {
    rootConductor = new Conductor;
  }
  return rootConductor;
}
