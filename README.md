
# koa-formatter

A response body formatter for [Koa](https://github.com/koajs/koa).

This middleware can be used to format the JSON result of API calls.

## Features

* Custom format function
* Handle aggregation of errors

## Installation

[![NPM](https://nodei.co/npm/koa-formatter.png?downloads=true)](https://nodei.co/npm/koa-formatter/)

```
$ npm install koa-formatter
```

## Usage

```javascript
const Koa = require('koa');
const formatter = require('koa-formatter');

const app = new Koa();

app.use(formatter());
app.use(formatter({ formatter: function(ctx, errors) {
  ctx.body = (errors.length ? 'some errors occurred' : 'ok');
}}))
```

## Formatter

The library comes with a built-in formatter.

```javascript
app.use(formatter({ formatter: formatter.defaultFormatter() }));
app.use(function(ctx) {
  ctx.throw('simple error');
});
```

```json
{
  "ok": 0,
  "status": 500,
  "errors": [ "simple error" ]
}
```

```javascript
app.use(formatter({ formatter: formatter.defaultFormatter() }));
app.use(function(ctx) {
  ctx.result = [ 'John' ];
});
```

```json
{
  "ok": 1,
  "status": 200,
  "result": [
    "John"
  ]
}
```

## Licences

[MIT](LICENSE)