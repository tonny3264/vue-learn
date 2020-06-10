export function forEachValue (obj, fn) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      fn(key, value);
    }
  }
}