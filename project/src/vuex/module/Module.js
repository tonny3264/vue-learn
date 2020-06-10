
import { forEachValue } from '../util';

export default class Module {
  constructor (rawModule) {
    this._rawModule = rawModule || {};
    this._children = {};
    this.state = rawModule.state || {};
  }
}