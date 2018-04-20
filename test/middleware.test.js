"use strict";

const path = require('path');
const request = require('supertest');
const Koa = require('koa');
const should = require('should');

const formatter = require('../lib');

describe('test/middleware.test.js', function() {
  describe('with default formatter', function() {
    it('should generate body when no errors', function(done) {
      const app = new Koa();
      app.silent = true;
      app.use(formatter());
      app.use(function(ctx) {
        ctx.result = 'good';
      });
      request(app.listen())
        .get('/')
        .set('content-type', 'application/json')
        .expect(JSON.stringify({ ok: 1, status: 200, result: 'good' }))
        .expect(200, done);
    });
    it('should generate body when there is a single error', function(done) {
      const app = new Koa();
      app.silent = true;
      app.use(formatter());
      app.use(function(ctx) {
        ctx.throw('simple error');
      });
      request(app.listen())
        .get('/')
        .set('content-type', 'application/json')
        .expect(JSON.stringify({ ok: 0, status: 500, errors: [ 'simple error' ] }))
        .expect(500, done);
    });
    it('should generate body when there is an aggregate of errors', function(done) {
      const app = new Koa();
      app.silent = true;
      app.use(formatter());
      app.use(function() {
        throw [ new Error('simple error 1'), new Error('simple error 2') ];
      });
      request(app.listen())
        .get('/')
        .set('content-type', 'application/json')
        .expect(JSON.stringify({ ok: 0, status: 500, errors: [ 'simple error 1', 'simple error 2' ] }))
        .expect(500, done);
    });

    it('should generate body when there is an aggregate of errors using Promises', function(done) {
      const app = new Koa();
      app.silent = true;
      app.use(formatter());
      app.use(function() {
        return Promise.reject([new Error('simple error 1'), new Error('simple error 2')]);
      });
      request(app.listen())
        .get('/')
        .set('content-type', 'application/json')
        .expect(JSON.stringify({ ok: 0, status: 500, errors: [ 'simple error 1', 'simple error 2' ] }))
        .expect(500, done);
    });
  });
});