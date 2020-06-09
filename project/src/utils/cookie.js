export default class Cookie {

  /**
   * 根据key获取value:string
   * @param {string} key 键
   * @returns {string} undefined:不存在键; string:值
   */
  static getCookie(key) {
      var r = document.cookie.match("\\b" + key + "=([^;]*)\\b");
      return r ? unescape(r[1]) : undefined;
  }

  /**
   * 获得cookie值
   * @param {string} key 键
   * @returns {string} string:正确值;undefined:键不存在cookie中
   */
  static getCookieObj(key) {
      let value = Cookie.getCookie(key)
      if (!value || !value.length)
          return undefined;
      try {
          value = JSON.parse(value);
      } catch (error) {
          return undefined;
      }
      return value;
  }

  /**
   * 向对应key的cookie值中追加一个子值
   * @param {string} key 键
   * @param {*} val 子值(对应的cookie值之后的子值)
   * @returns {boolean} true:成功; false:失败,不存在key; 如果cookie值不是数组,则抛出异常
   */
  static appendCookie(key, val) {
      let value = Cookie.getCookieObj(key)
      if (!value) return false;
      if (value instanceof Array) {
          value.push(val);
          Cookie.setCookie(key, JSON.stringify(value));
      } else
          throw new Error('getCookie返回的不是数组,无法执行appendCookie');
      return true;
  }

  /**
   * 设置cookie
   * @param {string} key 键
   * @param {string} val 值
   * @param {any} time 过期秒数(0:删除; <0|undefined:永久有效;string:具体时间)
   * @returns {boolean} true:设置成功; false:设置失败
   */
  static setCookie(key, val, time = -1) {
      if (typeof (val) != "string") {
          val = JSON.stringify(val);
      }
      let expire = new Date();
      time = time == undefined ? -1 : time;
      if (typeof(time) == "number") {
          if (time < 0 || time == undefined)
              expire.setFullYear(expire.getFullYear() + 100); // 永久
          else if (time == 0)
              expire.setTime(expire.getTime() - 1);  // 删除
          else
              expire.setTime(expire.getTime() + time * 1000); // 指定
      } else {
          expire = new Date(time);
          if (!expire.getDate()) {
              return false;
          }
      }
      document.cookie = `${key}=${escape(val)};expires=${expire.toGMTString()};path=/`;
      return true;
  }

  /**
   * 根据key删除cookie值或者删除部分值
   * @param {string} key 键
   * @param {number} from 开始删除索引(不传:key对应的键值全部删除;>0从头开始;<0从右开始)
   * @param {number} count 删除的元素个数(不传:从from开始删到最后;<=0:无效;>0:删除的个数)
   * @returns {boolean} true:删除成功;false:删除失败
   */
  static deleteCookie(key, from, count) {
      let val = Cookie.getCookie(key);
      if (!val || !val.length) return false;
      if (from == undefined) {
          Cookie.setCookie(key, val, 0);
      } else {
          let obj = null;
          try {
              obj = JSON.parse(val);
          } catch (error) {
              //val是字符串
              if (count)
                  val = val.slice(from, count);
              else
                  val = val.slice(from);
              Cookie.setCookie(key, val);
              return true;
          }
          if (obj instanceof Array) {
              if (count)
                  obj.splice(from, count);
              else
                  obj.splice(from);
              Cookie.setCookie(key, JSON.stringify(obj));
              return true;
          } else {
              return false;
          }
      }
      return true; 
  }
}