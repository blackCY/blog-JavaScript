const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const handleCallbacks = (callback, state, result) => {
  while (callbacks.length) handleCallback(callback.shift(), state, result);
};

const transition = (promise, state, result) => {
  if (promise.state === PENDING) return;

  promise.state = state;
  promise.result = result;

  setTimeout(() => handleCallbacks(promise.callback, state, result), 0);
};

const handleCallback = (callback, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = callback;

  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result);
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result);
    }
  } catch (e) {
    reject(e);
  }
};

const resolvePromise = (promise, result, resolve, reject) => {
  if (result === promise) {
    return reject(new TypeError("Can not fulfill promise with itself"));
  }

  if (isPromise(result)) {
    return result.then(resolve, reject);
  }

  if (isThenable(result)) {
    try {
      let then = result.then;

      if (isFunction(then)) {
        return new _Promise(then.bind(result)).then(resolve, reject);
      }
    } catch (e) {
      return reject(e);
    }
  }
};

function _Promise(f) {
  this.state = PENDING;
  this.result = null;
  this.callbacks = [];

  let onFulfilled = (value) => transition(this, FULFILLED, value);
  let onRejected = (reason) => transition(this, REJECTED, reason);

  let ignore = false;

  let resolve = (value) => {
    if (ignore) return;
    ignore = true;
    resolvePromise(this, value, onFulfilled, onRejected);
  };

  let reject = (reason) => {
    if (ignore) return;
    ignore = true;
    onRejected(reason);
  };

  try {
    f(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

_Promise.prototype.then = function (onFulfilled, onRejected) {
  return new _Promise((resolve, reject) => {
    let callback = { onFulfilled, onRejected, resolve, reject };

    if (this.state === PENDING) {
      this.callbacks.push(callback);
    } else {
      setTimeout(() => handleCallback(callback, this.state, this.result), 0);
    }
  });
};
