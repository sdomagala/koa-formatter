"use strict";

function createDefaultFormatter() {
  return function defaultFormatter(ctx, errors) {
    ctx.body = {};
    if (errors && errors.length) {
      ctx.status = 500;
      if (errors.length === 1) {
        ctx.status = errors[0].status || ctx.status;
      }
      ctx.body['ok'] = 0;
      ctx.body['status'] = ctx.status;
      ctx.body['errors'] = errors.map((error) => {
        return error.message;
      });
    } else {
      ctx.body['ok'] = 1;
    }
    ctx.body['status'] = ctx.status;
    if (ctx.result != null) {
      ctx.body['result'] = ctx.result;
    }
  }
}

module.exports = function (options) {
  options = options || {};
  const fn = options.formatter || createDefaultFormatter();
  return function formatter(ctx, next) {
    const self = this;
    return next().then(function () {
      fn(ctx);
    }).catch(function (err) {
      var errors;
      if (Array.isArray(err)) {
        errors = err;
      } else {
        errors = [ err ];
      }
      fn(ctx, errors);
      for (var i = 0; i < errors.length; i++) {
        ctx.app.emit('error', errors[i], self);
      }
    });
  }

};

module.exports.defaultFormatter = createDefaultFormatter;