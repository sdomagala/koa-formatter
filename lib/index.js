"use strict";

function koaFormatter(options) {
  options = options || {};
  const fn = options.formatter || createDefaultFormatter();
  return function formatter(ctx, next) {
    const self = this;
    return next().then(function () {
      fn(ctx);
    }).catch(function (error) {
      var errors;
      ctx.status = error.status || 500;
      if (Array.isArray(error)) {
        errors = error;
      } else {
        errors = [ error ];
      }
      for (var i = 0; i < errors.length; i++) {
        ctx.app.emit('error', errors[i], self);
      }
      return Promise.resolve(fn(ctx, errors));
    });
  }
}
module.exports = koaFormatter;

function createDefaultFormatter() {
  return function defaultFormatter(ctx, errors) {
    ctx.body = {};
    if (errors && errors.length) {
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
module.exports.defaultFormatter = createDefaultFormatter;