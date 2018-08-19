/**
 * @copyright 2018 Orino Labs GmbH
 * @author Michael Bürge <mib@orino.ch>
 */


export { Animation } from './animation.js';
export { Conductor } from './conductor.js';
import { Conductor } from './conductor.js';


type DOMHighResTimeStamp = number;


let rootConductor: Conductor;


export function getRootConductor(): Conductor {
  if (!rootConductor) {
    rootConductor = new Conductor;
  }
  return rootConductor;
}
