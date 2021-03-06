// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../../../node_modules/axios/lib/helpers/bind.js":[function(require,module,exports) {
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],"../../../node_modules/axios/lib/utils.js":[function(require,module,exports) {
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":"../../../node_modules/axios/lib/helpers/bind.js"}],"../../../node_modules/axios/lib/helpers/buildURL.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/core/InterceptorManager.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/core/transformData.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/cancel/isCancel.js":[function(require,module,exports) {
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],"../../../node_modules/axios/lib/helpers/normalizeHeaderName.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/core/enhanceError.js":[function(require,module,exports) {
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],"../../../node_modules/axios/lib/core/createError.js":[function(require,module,exports) {
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":"../../../node_modules/axios/lib/core/enhanceError.js"}],"../../../node_modules/axios/lib/core/settle.js":[function(require,module,exports) {
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":"../../../node_modules/axios/lib/core/createError.js"}],"../../../node_modules/axios/lib/helpers/cookies.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/helpers/isAbsoluteURL.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],"../../../node_modules/axios/lib/helpers/combineURLs.js":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],"../../../node_modules/axios/lib/core/buildFullPath.js":[function(require,module,exports) {
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/isAbsoluteURL":"../../../node_modules/axios/lib/helpers/isAbsoluteURL.js","../helpers/combineURLs":"../../../node_modules/axios/lib/helpers/combineURLs.js"}],"../../../node_modules/axios/lib/helpers/parseHeaders.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/helpers/isURLSameOrigin.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/adapters/xhr.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"./../utils":"../../../node_modules/axios/lib/utils.js","./../core/settle":"../../../node_modules/axios/lib/core/settle.js","./../helpers/cookies":"../../../node_modules/axios/lib/helpers/cookies.js","./../helpers/buildURL":"../../../node_modules/axios/lib/helpers/buildURL.js","../core/buildFullPath":"../../../node_modules/axios/lib/core/buildFullPath.js","./../helpers/parseHeaders":"../../../node_modules/axios/lib/helpers/parseHeaders.js","./../helpers/isURLSameOrigin":"../../../node_modules/axios/lib/helpers/isURLSameOrigin.js","../core/createError":"../../../node_modules/axios/lib/core/createError.js"}],"../../../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../../../node_modules/axios/lib/defaults.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

},{"./utils":"../../../node_modules/axios/lib/utils.js","./helpers/normalizeHeaderName":"../../../node_modules/axios/lib/helpers/normalizeHeaderName.js","./adapters/xhr":"../../../node_modules/axios/lib/adapters/xhr.js","./adapters/http":"../../../node_modules/axios/lib/adapters/xhr.js","process":"../../../node_modules/process/browser.js"}],"../../../node_modules/axios/lib/core/dispatchRequest.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"./../utils":"../../../node_modules/axios/lib/utils.js","./transformData":"../../../node_modules/axios/lib/core/transformData.js","../cancel/isCancel":"../../../node_modules/axios/lib/cancel/isCancel.js","../defaults":"../../../node_modules/axios/lib/defaults.js"}],"../../../node_modules/axios/lib/core/mergeConfig.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":"../../../node_modules/axios/lib/utils.js"}],"../../../node_modules/axios/lib/core/Axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../utils":"../../../node_modules/axios/lib/utils.js","../helpers/buildURL":"../../../node_modules/axios/lib/helpers/buildURL.js","./InterceptorManager":"../../../node_modules/axios/lib/core/InterceptorManager.js","./dispatchRequest":"../../../node_modules/axios/lib/core/dispatchRequest.js","./mergeConfig":"../../../node_modules/axios/lib/core/mergeConfig.js"}],"../../../node_modules/axios/lib/cancel/Cancel.js":[function(require,module,exports) {
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],"../../../node_modules/axios/lib/cancel/CancelToken.js":[function(require,module,exports) {
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":"../../../node_modules/axios/lib/cancel/Cancel.js"}],"../../../node_modules/axios/lib/helpers/spread.js":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],"../../../node_modules/axios/lib/helpers/isAxiosError.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],"../../../node_modules/axios/lib/axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./utils":"../../../node_modules/axios/lib/utils.js","./helpers/bind":"../../../node_modules/axios/lib/helpers/bind.js","./core/Axios":"../../../node_modules/axios/lib/core/Axios.js","./core/mergeConfig":"../../../node_modules/axios/lib/core/mergeConfig.js","./defaults":"../../../node_modules/axios/lib/defaults.js","./cancel/Cancel":"../../../node_modules/axios/lib/cancel/Cancel.js","./cancel/CancelToken":"../../../node_modules/axios/lib/cancel/CancelToken.js","./cancel/isCancel":"../../../node_modules/axios/lib/cancel/isCancel.js","./helpers/spread":"../../../node_modules/axios/lib/helpers/spread.js","./helpers/isAxiosError":"../../../node_modules/axios/lib/helpers/isAxiosError.js"}],"../../../node_modules/axios/index.js":[function(require,module,exports) {
module.exports = require('./lib/axios');
},{"./lib/axios":"../../../node_modules/axios/lib/axios.js"}],"login.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.login = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var login = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var email, password, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            email = form.email.value;
            password = form.password.value;
            _context.next = 5;
            return (0, _axios.default)({
              method: "POST",
              url: "/api/v1/users/login",
              data: {
                email: email,
                password: password
              }
            });

          case 5:
            res = _context.sent;
            console.log(res);

            if (res.data.status === "success") {
              location.assign("/admin");
            }

            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function login(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.login = login;

var logout = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _axios.default.get("/api/v1/users/logout");

          case 3:
            res = _context2.sent;

            if (res.data.status === "success") {
              window.location.href = window.location.href;
            }

            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function logout() {
    return _ref2.apply(this, arguments);
  };
}();

exports.logout = logout;
},{"axios":"../../../node_modules/axios/index.js"}],"category.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCategory = exports.createCategory = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createCategory = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var category, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            category = {};
            category.title = form.title.value.trim();
            _context.prev = 2;
            _context.next = 5;
            return (0, _axios.default)({
              method: "POST",
              url: "/api/v1/categories",
              data: category
            });

          case 5:
            res = _context.sent;

            if (res.data.status === "success") {
              window.location.href = "".concat(window.location.origin, "/admin/categories/all");
            }

            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            console.error(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));

  return function createCategory(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createCategory = createCategory;

var deleteCategory = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _axios.default)({
              method: "DELETE",
              url: "/api/v1/categories/".concat(id)
            });

          case 3:
            res = _context2.sent;

            if (res.status === 204) {
              window.location.href = "".concat(window.location.origin, "/admin/categories/all");
            }

            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function deleteCategory(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.deleteCategory = deleteCategory;
},{"axios":"../../../node_modules/axios/index.js"}],"alerts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAlert = exports.hideAlert = void 0;

var hideAlert = function hideAlert() {
  var el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
}; // type is 'success' or 'error'


exports.hideAlert = hideAlert;

var showAlert = function showAlert(type, msg) {
  hideAlert();
  var markup = "<div class=\"alert alert--".concat(type, "\">").concat(msg, "</div>");
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

exports.showAlert = showAlert;
},{}],"products.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProduct = exports.createOrUpdateProduct = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var productForm = {};

var createOrUpdateProduct = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var productId, visibility;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            productId = form.dataset.id;
            visibility = form.visibility.selectedOptions[0].dataset.bool === "yes" ? true : false;
            productForm.title = form.title.value;
            productForm.price = form.price.value;
            productForm.stockQuantity = form.stockQuantity.value;
            productForm.category = form.categories.selectedOptions[0].dataset.id;
            productForm.isVisible = visibility;

            if (!productId) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return updateProduct(productForm, productId);

          case 10:
            return _context.abrupt("return", _context.sent);

          case 11:
            _context.next = 13;
            return createProduct(productForm);

          case 13:
            return _context.abrupt("return", _context.sent);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createOrUpdateProduct(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createOrUpdateProduct = createOrUpdateProduct;

var updateProduct = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, id) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            (0, _alerts.showAlert)("success", "Product Updating...");
            _context2.next = 4;
            return (0, _axios.default)({
              method: "PATCH",
              url: "/api/v1/products/".concat(id),
              data: data
            });

          case 4:
            res = _context2.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Product Updated!");
              window.location.href = "".concat(window.location.origin, "/admin/products/").concat(res.data.data.slug);
            }

            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function updateProduct(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var createProduct = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
    var res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            (0, _alerts.showAlert)("success", "Creating Product..");
            _context3.next = 4;
            return (0, _axios.default)({
              method: "POST",
              url: "/api/v1/products",
              data: data
            });

          case 4:
            res = _context3.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Product Created!");
              window.location.href = "".concat(window.location.origin, "/admin/products/").concat(res.data.data.slug);
            }

            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function createProduct(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var deleteProduct = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id) {
    var res;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            (0, _alerts.showAlert)("success", "Deleting Product..");
            _context4.next = 4;
            return (0, _axios.default)({
              method: "DELETE",
              url: "/api/v1/products/".concat(id)
            });

          case 4:
            res = _context4.sent;

            if (res.status === 204) {
              (0, _alerts.showAlert)("success", "Product Deleted!");
              window.location.href = "".concat(window.location.origin, "/admin/categories/all");
            }

            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function deleteProduct(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

exports.deleteProduct = deleteProduct;
},{"axios":"../../../node_modules/axios/index.js","./alerts":"alerts.js"}],"customers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateCustomer = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var customer = {};

var createOrUpdateCustomer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var id;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = form.dataset.id;
            console.log("Connected!");
            customer.name = form.name.value.trim();
            customer.phoneNumber = form.phoneNumber.value.trim();

            if (!id) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return updateCustomer(customer, id);

          case 7:
            return _context.abrupt("return", _context.sent);

          case 8:
            _context.next = 10;
            return createCustomer(customer);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createOrUpdateCustomer(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createOrUpdateCustomer = createOrUpdateCustomer;

var createCustomer = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            (0, _alerts.showAlert)("success", "Creating Customer..");
            _context2.next = 4;
            return (0, _axios.default)({
              method: "POST",
              url: "/api/v1/customers",
              data: data
            });

          case 4:
            res = _context2.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Customer Created!");
              window.location.href = "".concat(window.location.origin, "/admin/customers/").concat(res.data.data.slug);
            }

            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function createCustomer(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var updateCustomer = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, id) {
    var res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            (0, _alerts.showAlert)("success", "Updating Customer..");
            _context3.next = 4;
            return (0, _axios.default)({
              method: "PATCH",
              url: "/api/v1/customers/".concat(id),
              data: data
            });

          case 4:
            res = _context3.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Customer Updated!");
              window.location.href = "".concat(window.location.origin, "/admin/customers/").concat(res.data.data.slug);
            }

            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function updateCustomer(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
},{"axios":"../../../node_modules/axios/index.js","./alerts":"alerts.js"}],"branch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addProductsToBranch = exports.createBranch = void 0;

var _regeneratorRuntime = require("regenerator-runtime");

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createBranch = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var branch;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            branch = {};
            branch.name = form.name.value.trim();
            _context.next = 4;
            return createNewBranch(branch);

          case 4:
            return _context.abrupt("return", _context.sent);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createBranch(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createBranch = createBranch;

var createNewBranch = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            (0, _alerts.showAlert)("success", "Creating Branch..");
            _context2.next = 4;
            return (0, _axios.default)({
              method: "POST",
              url: "/api/v1/branches",
              data: data
            });

          case 4:
            res = _context2.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Branch Created!"); //   window.location.href = `${window.location.origin}/admin/branches/${res.data.data.slug}`;

              window.location.href = "".concat(window.location.origin, "/admin/branches/all");
            }

            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function createNewBranch(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var addProductsToBranch = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(form) {
    var branch, warehouseProducts, branchProductEls, checkedProductIds, checkboxEls, otherProductEls;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            branch = {
              products: []
            };
            warehouseProducts = []; // For Products Already In Branch

            branchProductEls = document.querySelectorAll(".branchProducts");
            branchProductEls.forEach(function (el) {
              // 1. Grab the data
              var productID = el.dataset.id;
              var branchStock = +el.dataset.currBranchStock;
              var warehouseStock = +el.dataset.currWarehouseStock;
              var supplyQuantity = +el.value.trim();
              var newBranchStock = branchStock + supplyQuantity;
              var newWarehouseStock = warehouseStock - supplyQuantity; // 2. Update Branch

              var product = {
                type: "",
                stockQuantity: 0
              };
              product.type = productID;
              product.stockQuantity = newBranchStock;
              branch.products.push(product); // 3. Update EACH product

              var warehouseProduct = {
                id: "",
                stockQuantity: 0
              };
              warehouseProduct.id = productID;
              warehouseProduct.stockQuantity = newWarehouseStock;
              warehouseProducts.push(warehouseProduct);
            }); // For Products About to be added to the Branch

            checkedProductIds = [];
            checkboxEls = document.querySelectorAll(".checkbox");
            checkboxEls.forEach(function (el) {
              el.checked ? checkedProductIds.unshift(el.dataset.id) : ""; // checkedProductIds.unshift(el.dataset.id);
            });
            otherProductEls = document.querySelectorAll(".otherProducts");
            otherProductEls.forEach(function (el) {
              if (!checkedProductIds.includes(el.dataset.id)) return; // GRAB THE DATA

              var productID = el.dataset.id;
              var warehouseStock = +el.dataset.currWarehouseStock;
              var supplyQuantity = +el.value.trim();
              var newWarehouseStock = warehouseStock - supplyQuantity; // UPDATE BRANCH

              var product = {
                type: "",
                stockQuantity: 0
              };
              product.type = el.dataset.id;
              product.stockQuantity = +el.value.trim(); // product.stockQuantity = 10;

              branch.products.push(product); // UPDATE WAREHOUSE

              var warehouseProduct = {
                id: "",
                stockQuantity: 0
              };
              warehouseProduct.id = productID;
              warehouseProduct.stockQuantity = newWarehouseStock;
              warehouseProducts.push(warehouseProduct);
            });

            if (!(warehouseProducts.length > 0)) {
              _context3.next = 12;
              break;
            }

            _context3.next = 12;
            return updateManyProducts(warehouseProducts);

          case 12:
            if (!(branch.products.length > 0)) {
              _context3.next = 16;
              break;
            }

            _context3.next = 15;
            return updateBranch(branch, form.dataset.id);

          case 15:
            return _context3.abrupt("return", _context3.sent);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function addProductsToBranch(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addProductsToBranch = addProductsToBranch;

var updateBranch = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data, id) {
    var res;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            (0, _alerts.showAlert)("success", "Branch Updating");
            _context4.next = 4;
            return (0, _axios.default)({
              method: "PATCH",
              url: "/api/v1/branches/".concat(id),
              data: data
            });

          case 4:
            res = _context4.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Branch Updated Successfully!");
              window.location.href = "".concat(window.location.origin, "/admin/branches/").concat(res.data.data.slug);
            }

            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function updateBranch(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var updateManyProducts = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(arr) {
    var res;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            (0, _alerts.showAlert)("success", "Products Updating...");
            _context5.next = 4;
            return (0, _axios.default)({
              method: "PATCH",
              url: "/api/v1/products/update-many",
              data: arr
            });

          case 4:
            res = _context5.sent;

            if (!(res.data.status === "success")) {
              _context5.next = 8;
              break;
            }

            (0, _alerts.showAlert)("success", "Products Updated!");
            return _context5.abrupt("return");

          case 8:
            _context5.next = 14;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");
            console.error(_context5.t0);

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 10]]);
  }));

  return function updateManyProducts(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
},{"regenerator-runtime":"../../../node_modules/regenerator-runtime/runtime.js","axios":"../../../node_modules/axios/index.js","./alerts":"alerts.js"}],"cart.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderDeliveryHtml = renderDeliveryHtml;
exports.renderDiscountHtml = renderDiscountHtml;
exports.addToCart = addToCart;
exports.cart = void 0;

var _order = require("./order");

var cartTotalEl = document.querySelector(".cartTotal");
var numOfItemsEl = document.querySelector(".numOfItems");
var cart = {
  itemIds: [],
  items: [],
  numOfItems: 0,
  subtotal: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0,
  renderTotal: function renderTotal() {
    this.total = this.subtotal + this.deliveryFee - this.discount;
    cartTotalEl.textContent = "GHS ".concat(this.total);
    numOfItemsEl.textContent = this.numOfItems;
  }
};
exports.cart = cart;
var cartItemsContainer = document.querySelector(".cartItemsContainer");
var deliveryFeeContainer = document.querySelector(".deliveryFeeContainer");
var discountContainer = document.querySelector(".discountContainer");

var renderCartHtml = function renderCartHtml() {
  cartItemsContainer.innerHTML = "";
  var numOfItems = 0;
  var total = 0;
  cart.items.forEach(function (item) {
    var html = "<li class=\"list-group-item d-flex justify-content-between lh-condensed\">\n      <div>\n        <h6 class=\"my-0\">".concat(item.title, " x").concat(item.quantity, "</h6>\n      </div>\n      <span class=\"text-muted\">GHS ").concat(item.subtotal, "</span>\n    </li>");
    cartItemsContainer.insertAdjacentHTML("afterbegin", html); // Calc subtotal

    total += item.subtotal;
    numOfItems += item.quantity;
  });
  cart.numOfItems = numOfItems;
  cart.subtotal = total;
  cart.renderTotal();
};

function renderDeliveryHtml() {
  (0, _order.clearFields)();
  deliveryFeeContainer.innerHTML = "";

  if (+this.value.trim() === 0) {
    cart.deliveryFee = +this.value;
    return cart.renderTotal();
  }

  var html = "<li class=\"list-group-item d-flex justify-content-between lh-condensed\">\n      <div>\n        <h6 class=\"my-0\">Delivery Fee</h6>\n      </div>\n      <span class=\"text-muted\">GHS ".concat(this.value, "</span>\n    </li>");
  deliveryFeeContainer.insertAdjacentHTML("afterbegin", html);
  cart.deliveryFee = +this.value;
  cart.renderTotal();
}

function renderDiscountHtml() {
  (0, _order.clearFields)();
  discountContainer.innerHTML = "";

  if (+this.value.trim() === 0) {
    cart.discount = +this.value;
    return cart.renderTotal();
  }

  var html = " <li class=\"list-group-item d-flex justify-content-between bg-light\">\n          <div class=\"text-success\">\n            <h6 class=\"my-0\">Discount</h6>\n            <span class=\"text-success\"> -GHS ".concat(this.value, "</span>\n          </div>\n        </li>");
  discountContainer.insertAdjacentHTML("afterbegin", html);
  cart.discount = +this.value;
  cart.renderTotal();
}

function addToCart() {
  var _this = this;

  if (!this.checked) {
    cart.itemIds.pop(this.dataset.id);
    var item = cart.items.find(function (item) {
      return item.id === _this.dataset.id;
    });
    if (item) cart.items.pop(item);
    renderCartHtml();
    return;
  }

  cart.itemIds.unshift(this.dataset.id);
  var productEls = document.querySelectorAll(".products");
  productEls.forEach(function (el) {
    setCartItems(el);
    el.addEventListener("input", function () {
      setCartItems(this);
    });
  }); // console.log(cart.items);
}

function setCartItems(el) {
  // If it hasn't been selected or the quantity is 0, return
  if (!cart.itemIds.includes(el.dataset.id)) return;
  if (+el.value === 0) return; // If item is already in the cart, increase the quantity

  var existingItem = cart.items.find(function (item) {
    return item.id === el.dataset.id;
  });

  if (existingItem) {
    existingItem.quantity = +el.value.trim();
    existingItem.price = +el.dataset.price;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
    renderCartHtml();
    return;
  }

  var item = {
    id: "",
    title: "",
    quantity: 0,
    price: 0,
    subtotal: 0
  };
  item.id = el.dataset.id;
  item.title = el.dataset.title;
  item.quantity = +el.value.trim();
  item.price = +el.dataset.price;
  item.subtotal = item.quantity * item.price;
  cart.items.push(item);
  renderCartHtml();
}
},{"./order":"order.js"}],"order.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateOrder = exports.completeOrder = exports.getCustomerResults = exports.getProductResults = exports.clearFields = exports.orderDetails = exports.data = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _regeneratorRuntime = require("regenerator-runtime");

var _alerts = require("./alerts");

var _cart = require("./cart");

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var data = {
  products: [],
  customers: []
};
exports.data = data;
var orderDetails = {
  products: [],
  customer: "",
  user: "",
  branch: "",
  totalAmount: 0,
  amountPaid: 0,
  type: "",
  discount: 0,
  deliveryFee: 0,
  subtotal: 0 // refund: {
  //   products: [],
  //   totalAmountRefunded: 0,
  //   user: "",
  // },

};
exports.orderDetails = orderDetails;
var productElContainer = document.querySelector(".productSearchResults");
var customerElContainer = document.querySelector(".customerSearchResults");
var customerNameEl = document.querySelector(".customerName");

var clearFields = function clearFields() {
  _index.productInputEl.value = "";
  productElContainer.innerHTML = "";
};

exports.clearFields = clearFields;

var insertProductEl = function insertProductEl(product) {
  var html = "<div class=\"input-group mb-3\">\n        \n          <input class=\"form-control\" type=\"text\" value=\"".concat(product.type.title, " -- ").concat(product.type.price, " GHS\" />\n          <input\n            class=\"products form-control\"\n            type=\"number\"\n            value=\"0\"\n            min=\"0\"\n            max=\"").concat(product.stockQuantity, "\"\n            data-id=\"").concat(product.type.id, "\"\n            data-price=\"").concat(product.type.price, "\"\n            data-title=\"").concat(product.type.title, "\"\n            data-curr-branch-stock=\"").concat(product.stockQuantity, "\"\n            data-curr-warehouse-stock=\"").concat(product.type.stockQuantity, "\"\n          />\n        <div class=\"input-group-prepend\">\n          <div class=\"input-group-text\">\n            <input class=\"addToCart\" type=\"checkbox\" data-id=\"").concat(product.type.id, "\" />\n          </div>\n        </div>\n      </div>");
  productElContainer.insertAdjacentHTML("afterbegin", html);
  var addToCartBtns = document.querySelectorAll(".addToCart");
  addToCartBtns.forEach(function (btn) {
    return btn.addEventListener("click", _cart.addToCart);
  });
};

var insertCustomerEl = function insertCustomerEl(customer) {
  var html = "<div class=\"list-group\">\n        <a class=\"customer list-group-item list-group-item-action\" \n        href=\"#\" data-id=\"".concat(customer._id, "\" data-name=\"").concat(customer.name, "\">\n          ").concat(customer.name, "\n        </a>\n      </div>");
  customerElContainer.insertAdjacentHTML("afterbegin", html);
};

var getProductResults = function getProductResults(input) {
  productElContainer.innerHTML = "";
  var products = data.products;
  if (input.value.trim() === "") return productElContainer.innerHTML = "";
  var results = products.filter(function (product) {
    var title = product.type.title.toLowerCase();
    return title.startsWith(input.value.trim().toLowerCase());
  });
  results.forEach(function (res) {
    return insertProductEl(res);
  });
};

exports.getProductResults = getProductResults;

var getCustomerResults = function getCustomerResults(input) {
  customerElContainer.innerHTML = "";
  var customers = data.customers;
  if (input.value.trim() === "") return customerElContainer.innerHTML = "";
  var results = customers.filter(function (customer) {
    var name = customer.name.toLowerCase();
    return name.startsWith(input.value.trim().toLowerCase());
  });
  results.forEach(function (res) {
    return insertCustomerEl(res);
  });
  var customerEls = document.querySelectorAll(".customer");
  customerEls.forEach(function (el) {
    return el.addEventListener("click", function () {
      orderDetails.customer = this.dataset.id;
      customerNameEl.textContent = this.dataset.name;
      input.value = "";
      customerElContainer.innerHTML = "";
    });
  });
};

exports.getCustomerResults = getCustomerResults;

var completeOrder = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(form.orderType.value.toLowerCase() === "regular" && +form.amountPaid.value.trim() !== _cart.cart.total || !orderDetails.customer || _cart.cart.items.length === 0)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", (0, _alerts.showAlert)("error", "Something Went Wrong"));

          case 2:
            orderDetails.products = _cart.cart.items.map(function (item) {
              var product = {};
              product.type = item.id;
              product.orderQuantity = item.quantity;
              product.purchasePrice = item.price;
              return product;
            });
            orderDetails.totalAmount = _cart.cart.total;
            orderDetails.amountPaid = +form.amountPaid.value.trim();
            orderDetails.type = form.orderType.value.toLowerCase();
            orderDetails.deliveryFee = _cart.cart.deliveryFee;
            orderDetails.subtotal = _cart.cart.subtotal;
            orderDetails.discount = _cart.cart.discount; // orderDetails.refund.user = orderDetails.user;
            // return console.log(orderDetails);

            _context.next = 11;
            return createOrder(orderDetails);

          case 11:
            return _context.abrupt("return", _context.sent);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function completeOrder(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.completeOrder = completeOrder;

var createOrder = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _alerts.showAlert)("success", "Creating Order..");
            _context2.prev = 1;
            _context2.next = 4;
            return _axios.default.post("/api/v1/orders", data);

          case 4:
            res = _context2.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Order Created!");
              window.location.href = "".concat(window.location.origin, "/admin/orders/all");
            }

            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            console.error(_context2.t0);
            (0, _alerts.showAlert)("error", "Order Creation Aborted");

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));

  return function createOrder(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var updateOrder = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(form) {
    var data, res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(+form.payment.value.trim() > +form.dataset.amountOwed || +form.payment.value.trim() === 0)) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return", (0, _alerts.showAlert)("error", "Enter a valid amount"));

          case 2:
            data = {};
            data.customerDebt = +form.dataset.customerDebt - +form.payment.value.trim();
            data.orderAmountPaid = +form.dataset.totalOrderPaid + +form.payment.value.trim();
            data.orderID = form.dataset.order;
            data.customer = form.dataset.customer;
            _context3.prev = 7;
            (0, _alerts.showAlert)("success", "Updating Order");
            _context3.next = 11;
            return _axios.default.patch("/api/v1/orders/".concat(data.orderID), data);

          case 11:
            res = _context3.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Order Updated Successfully");
              window.location.href = "".concat(window.location.origin, "/admin/orders/all");
            }

            _context3.next = 19;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](7);
            console.error(_context3.t0);
            (0, _alerts.showAlert)("error", "Something went wrong.");

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[7, 15]]);
  }));

  return function updateOrder(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateOrder = updateOrder;
},{"axios":"../../../node_modules/axios/index.js","regenerator-runtime":"../../../node_modules/regenerator-runtime/runtime.js","./alerts":"alerts.js","./cart":"cart.js","./index":"index.js"}],"refund.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToRefundCart = addToRefundCart;
exports.createRefund = exports.refund = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var refundTotalEl = document.querySelector(".refundTotal");
var numOfItemsEl = document.querySelector(".numOfItems");
var refundItemsContainer = document.querySelector(".refundItemsContainer");
var refund = {
  itemIds: [],
  items: [],
  numOfItems: 0,
  total: 0,
  renderTotal: function renderTotal() {
    refundTotalEl.textContent = "GHS ".concat(this.total);
    numOfItemsEl.textContent = this.numOfItems;
  }
};
exports.refund = refund;

var renderRefundCartHtml = function renderRefundCartHtml() {
  refundItemsContainer.innerHTML = "";
  var numOfItems = 0;
  var totalRefund = 0;
  refund.items.forEach(function (item) {
    var html = "<li class=\"list-group-item d-flex justify-content-between lh-condensed\">\n      <div>\n        <h6 class=\"my-0\">".concat(item.title, " x").concat(item.quantity, "</h6>\n      </div>\n      <span class=\"text-muted\">GHS ").concat(item.subtotal, "</span>\n    </li>");
    refundItemsContainer.insertAdjacentHTML("afterbegin", html); // Calc subtotal

    totalRefund += item.subtotal;
    numOfItems += item.quantity;
  });
  refund.numOfItems = numOfItems;
  refund.total = totalRefund;
  refund.renderTotal();
};

function addToRefundCart() {
  var _this = this;

  if (!this.checked) {
    refund.itemIds.pop(this.dataset.id);
    var item = refund.items.find(function (item) {
      return item.id === _this.dataset.id;
    });
    if (item) refund.items.pop(item);
    renderRefundCartHtml();
    return;
  }

  refund.itemIds.unshift(this.dataset.id);
  var productEls = document.querySelectorAll(".products");
  productEls.forEach(function (el) {
    setRefundCartItems(el);
    el.addEventListener("input", function () {
      setRefundCartItems(this);
    });
  });
}

function setRefundCartItems(el) {
  // If it hasn't been selected or the quantity is 0, return
  if (!refund.itemIds.includes(el.dataset.id)) return;
  if (+el.value === 0) return; // If item is already in the refund, increase the quantity

  var existingItem = refund.items.find(function (item) {
    return item.id === el.dataset.id;
  });

  if (existingItem) {
    existingItem.quantity = +el.value.trim();
    existingItem.price = +el.dataset.price;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
    renderRefundCartHtml();
    return;
  }

  var item = {
    id: "",
    title: "",
    quantity: 0,
    price: 0,
    subtotal: 0
  };
  item.id = el.dataset.id;
  item.title = el.dataset.title;
  item.quantity = +el.value.trim();
  item.price = +el.dataset.price;
  item.subtotal = item.quantity * item.price;
  refund.items.push(item);
  renderRefundCartHtml();
} // 1. Order ID
// 2. Products
// 3. User ID


var createRefund = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var data, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(+form.totalRefund.value.trim() < 1 || +form.totalRefund.value.trim() !== refund.total)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", (0, _alerts.showAlert)("error", "Enter A Valid Amount"));

          case 2:
            data = {
              refund: {
                products: [],
                totalAmountRefunded: 0,
                user: ""
              },
              branch: "",
              customer: "",
              type: "",
              amountPaid: 0,
              totalAmount: 0
            };
            data.refund.products = refund.items.map(function (item) {
              var product = {};
              product.type = item.id;
              product.quantity = item.quantity;
              product.amountRefunded = item.subtotal;
              return product;
            });
            data.refund.totalAmountRefunded = refund.total;
            data.refund.user = form.dataset.user;
            data.branch = form.dataset.branch;
            data.customer = form.dataset.customer;
            data.type = form.dataset.type;
            data.totalAmount = +form.dataset.totalAmount - refund.total;
            data.amountPaid = form.dataset.type !== "credit" ? +form.dataset.amountPaid - refund.total : +form.dataset.amountPaid; // console.log(data);

            _context.prev = 11;
            (0, _alerts.showAlert)("success", "Creating Refund");
            _context.next = 15;
            return _axios.default.patch("/api/v1/orders/".concat(form.dataset.order, "/refund"), data);

          case 15:
            res = _context.sent;

            if (res.data.status === "success") {
              (0, _alerts.showAlert)("success", "Refund Created Successfully");
              window.location.href = "".concat(window.location.origin, "/admin/orders/all");
            }

            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](11);
            console.error(_context.t0);
            (0, _alerts.showAlert)("error", "Something Went Wrong");

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 19]]);
  }));

  return function createRefund(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createRefund = createRefund;
},{"axios":"../../../node_modules/axios/index.js","./alerts":"alerts.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productInputEl = void 0;

var _regeneratorRuntime = _interopRequireWildcard(require("regenerator-runtime"));

var _login = require("./login");

var _category = require("./category");

var _products = require("./products");

var _customers = require("./customers");

var _branch = require("./branch");

var _order = require("./order");

var _cart = require("./cart");

var _refund = require("./refund");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var loginForm = document.querySelector(".loginForm");
var logoutBtn = document.querySelector(".logout");
var categoryForm = document.querySelector(".categoryForm");
var deleteCategoryBtn = document.querySelector(".deleteCategory");
var confirmDeleteProductBtns = document.querySelectorAll(".confirmDelete");
var productForms = document.querySelectorAll(".productForm");
var customerForm = document.querySelector(".customerForm");
var branchForm = document.querySelector(".branchForm");
var addProductsForm = document.querySelector(".addProductsForm");
var orderForm = document.querySelector(".orderForm");
var orderUpdateForm = document.querySelector(".orderUpdateForm");
var refundForm = document.querySelector(".refundForm");
var refundCheckboxEls = document.querySelectorAll(".addToRefundCart");
var productInputEl = document.getElementById("productInput");
exports.productInputEl = productInputEl;
var customerInputEl = document.getElementById("customerInput");
var deliveryInputEl = document.getElementById("deliveryFee");
var discountInputEl = document.getElementById("discount"); // Handler Functions

function handleLogin(_x) {
  return _handleLogin.apply(this, arguments);
}

function _handleLogin() {
  _handleLogin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee(e) {
    return _regeneratorRuntime.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            _context.next = 3;
            return (0, _login.login)(this);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _handleLogin.apply(this, arguments);
}

function handleLogout(_x2) {
  return _handleLogout.apply(this, arguments);
}

function _handleLogout() {
  _handleLogout = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee2(e) {
    return _regeneratorRuntime.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();
            _context2.next = 3;
            return (0, _login.logout)(this);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _handleLogout.apply(this, arguments);
}

function handleCategoryForm(_x3) {
  return _handleCategoryForm.apply(this, arguments);
}

function _handleCategoryForm() {
  _handleCategoryForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee3(e) {
    return _regeneratorRuntime.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            e.preventDefault();
            _context3.next = 3;
            return (0, _category.createCategory)(this);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _handleCategoryForm.apply(this, arguments);
}

function handleDeleteCategory(_x4) {
  return _handleDeleteCategory.apply(this, arguments);
}

function _handleDeleteCategory() {
  _handleDeleteCategory = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee4(e) {
    return _regeneratorRuntime.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            e.preventDefault();
            _context4.next = 3;
            return (0, _category.deleteCategory)(e.target.dataset.id);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _handleDeleteCategory.apply(this, arguments);
}

function handleProductDelete(_x5) {
  return _handleProductDelete.apply(this, arguments);
}

function _handleProductDelete() {
  _handleProductDelete = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee5(e) {
    return _regeneratorRuntime.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            e.preventDefault();
            _context5.next = 3;
            return (0, _products.deleteProduct)(e.target.dataset.id);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _handleProductDelete.apply(this, arguments);
}

function handleProductForms(_x6) {
  return _handleProductForms.apply(this, arguments);
}

function _handleProductForms() {
  _handleProductForms = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee6(e) {
    return _regeneratorRuntime.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            e.preventDefault();
            _context6.next = 3;
            return (0, _products.createOrUpdateProduct)(this);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return _handleProductForms.apply(this, arguments);
}

function handleCustomerForm(_x7) {
  return _handleCustomerForm.apply(this, arguments);
}

function _handleCustomerForm() {
  _handleCustomerForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee7(e) {
    return _regeneratorRuntime.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            e.preventDefault();
            _context7.next = 3;
            return (0, _customers.createOrUpdateCustomer)(this);

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return _handleCustomerForm.apply(this, arguments);
}

function handleBranchForm(_x8) {
  return _handleBranchForm.apply(this, arguments);
}

function _handleBranchForm() {
  _handleBranchForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee8(e) {
    return _regeneratorRuntime.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            e.preventDefault();
            _context8.next = 3;
            return (0, _branch.createBranch)(this);

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return _handleBranchForm.apply(this, arguments);
}

function handleAddProductsForm(_x9) {
  return _handleAddProductsForm.apply(this, arguments);
}

function _handleAddProductsForm() {
  _handleAddProductsForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee9(e) {
    return _regeneratorRuntime.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            e.preventDefault();
            _context9.next = 3;
            return (0, _branch.addProductsToBranch)(this);

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));
  return _handleAddProductsForm.apply(this, arguments);
}

function handleGetAllProductsAndCustomers(form) {
  var products = JSON.parse(form.dataset.products);
  var customers = JSON.parse(form.dataset.customers);
  _order.data.products = products;
  _order.data.customers = customers;
  _order.orderDetails.user = form.dataset.user;
  _order.orderDetails.branch = form.dataset.branch;
}

function handleProductInput() {
  (0, _order.getProductResults)(this);
}

function handleCustomerInput() {
  (0, _order.getCustomerResults)(this);
}

function handleOrderForm(_x10) {
  return _handleOrderForm.apply(this, arguments);
}

function _handleOrderForm() {
  _handleOrderForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee10(e) {
    return _regeneratorRuntime.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            e.preventDefault();
            _context10.next = 3;
            return (0, _order.completeOrder)(this);

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));
  return _handleOrderForm.apply(this, arguments);
}

function handleOrderUpdateForm(_x11) {
  return _handleOrderUpdateForm.apply(this, arguments);
}

function _handleOrderUpdateForm() {
  _handleOrderUpdateForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee11(e) {
    return _regeneratorRuntime.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            e.preventDefault();
            _context11.next = 3;
            return (0, _order.updateOrder)(this);

          case 3:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));
  return _handleOrderUpdateForm.apply(this, arguments);
}

function handleRefundForm(_x12) {
  return _handleRefundForm.apply(this, arguments);
} // Event Listeners


function _handleRefundForm() {
  _handleRefundForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee12(e) {
    return _regeneratorRuntime.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            e.preventDefault();
            _context12.next = 3;
            return (0, _refund.createRefund)(this);

          case 3:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));
  return _handleRefundForm.apply(this, arguments);
}

if (loginForm) loginForm.addEventListener("submit", handleLogin);
if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
if (categoryForm) categoryForm.addEventListener("submit", handleCategoryForm);
if (deleteCategoryBtn) deleteCategoryBtn.addEventListener("click", handleDeleteCategory);

if (confirmDeleteProductBtns) {
  confirmDeleteProductBtns.forEach(function (btn) {
    return btn.addEventListener("click", handleProductDelete);
  });
}

if (productForms) {
  productForms.forEach(function (form) {
    form.addEventListener("submit", handleProductForms);
  });
}

if (customerForm) customerForm.addEventListener("submit", handleCustomerForm);
if (branchForm) branchForm.addEventListener("submit", handleBranchForm);
if (addProductsForm) addProductsForm.addEventListener("submit", handleAddProductsForm);

if (orderForm) {
  handleGetAllProductsAndCustomers(orderForm);
  productInputEl.addEventListener("input", handleProductInput);
  customerInputEl.addEventListener("input", handleCustomerInput);
  deliveryInputEl.addEventListener("input", _cart.renderDeliveryHtml);
  discountInputEl.addEventListener("input", _cart.renderDiscountHtml);

  _cart.cart.renderTotal();

  orderForm.addEventListener("submit", handleOrderForm);
}

if (orderUpdateForm) orderUpdateForm.addEventListener("submit", handleOrderUpdateForm);

if (refundForm) {
  _refund.refund.renderTotal();

  refundCheckboxEls.forEach(function (el) {
    return el.addEventListener("click", _refund.addToRefundCart);
  });
  refundForm.addEventListener("submit", handleRefundForm);
}
},{"regenerator-runtime":"../../../node_modules/regenerator-runtime/runtime.js","./login":"login.js","./category":"category.js","./products":"products.js","./customers":"customers.js","./branch":"branch.js","./order":"order.js","./cart":"cart.js","./refund":"refund.js"}]},{},["index.js"], null)
//# sourceMappingURL=/bundle.js.map