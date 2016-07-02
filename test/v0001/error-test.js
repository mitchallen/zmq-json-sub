"use strict";

/* global describe, before, it, it, ... after */

var request = require('supertest'),
    should = require('should'),
    sleep = require('sleep'),
    config = require('./test-config'),
    // TODO - this is very bad - use link
    ZmqJsonPub = require('../../../zmq-json-pub/zmq-json-pub'),
    ZmqJsonSub = require('../../zmq-json-sub'),
    service = config.service,
    publisher = config.publisher,
    subscriber = config.subscriber,
    pub = null,
    sub = null,
    lastMessage = null,
    lastTime = null;

describe('error suite ' + config.versionLabel, function () {
    before(function () {
        pub = new ZmqJsonPub();
        pub.publish(publisher.endpoint);
        pub.verbose = config.verbose;
    });
    beforeEach(function() {
        lastMessage = null;
        lastTime = null;
    })
    it('should throw error if no object specified', function (done) {
        var errCalled = false;
        sub = new ZmqJsonSub(null, function(err, data) {
            if (err) {
                errCalled = true;
                console.log(err);
                return;
            }
        });
        errCalled.should.eql(true);
        setTimeout(function () {
            done();
        }, config.doneTimeout);
    });
    it('should throw error if no endpoint specified', function (done) {
        var spec = {
            // endpoint: subscriber.endpoint, 
            filter: "", 
            onMessage: function (data) {
                let jstring = JSON.parse(data);
                if (config.verbose) {
                    console.log("DATA: " + data);
                    var date = new Date(jstring.timestamp);
                    console.log("DATE STAMP: " + date);
                }
                lastMessage = jstring.message;
                lastTime = jstring.timestamp;
            }
        };
        var errCalled = false;
        sub = new ZmqJsonSub(spec, function(err, data) {
            if (err) {
                errCalled = true;
                console.log(err);
                return;
            }
        });
        errCalled.should.eql(true);
        setTimeout(function () {
            done();
        }, config.doneTimeout);
    });
    it('should throw error if no onMessage callback specified', function (done) {
        var spec = {
            endpoint: subscriber.endpoint, 
            filter: "", 
            /*
            onMessage: function (data) {
                let jstring = JSON.parse(data);
                if (config.verbose) {
                    console.log("DATA: " + data);
                    var date = new Date(jstring.timestamp);
                    console.log("DATE STAMP: " + date);
                }
                lastMessage = jstring.message;
                lastTime = jstring.timestamp;
            }
            */
        };
        var errCalled = false;
        sub = new ZmqJsonSub(spec, function(err, data) {
            if (err) {
                errCalled = true;
                console.log(err);
                return;
            }
        });
        errCalled.should.eql(true);
        setTimeout(function () {
            done();
        }, config.doneTimeout);
    });
    after(function () {
        pub.close();
    });
});