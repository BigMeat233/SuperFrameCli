/**
 * 状态中心
 * 
 * Made By Douzi＂
 */
import events from 'events';
import {
  STATE_CENTER_ON_FIELD_CHANGE,
  STATE_CENTER_FIELD_CHANGE_TYPE,
} from '@constants/Macros';

class StateCenter extends events {
  constructor(...args) {
    super(...args);
    this._state = {};
  }

  /**
   * 设置指定field中的状态
   * @param {String} key - 状态的键值
   * @param {any} value - 状态的值
   */
  setState(key, value) {
    const preValue = this._state[key];
    const isExist = (key in this._state);
    const detail = isExist
      ? { type: STATE_CENTER_FIELD_CHANGE_TYPE.UPDATE, key, preValue }
      : { type: STATE_CENTER_FIELD_CHANGE_TYPE.APPEND, key, preValue: undefined };
    this._state[key] = value;
    this.emit(STATE_CENTER_ON_FIELD_CHANGE, detail);
  }

  /**
   * 读取指定field中的状态
   * @param {String} key - 状态的键值
   */
  getState(key) {
    return this._state[key];
  }

  /**
   * 删除指定field中的状态
   * @param {String} key - 状态的键值
   */
  removeState(key) {
    const preValue = this._state[key];
    const detail = { type: STATE_CENTER_FIELD_CHANGE_TYPE.REMOVE, key, preValue };
    delete this._state[key];
    this.emit(STATE_CENTER_ON_FIELD_CHANGE, detail);
  }
}

const singleton = new StateCenter();
export default singleton;