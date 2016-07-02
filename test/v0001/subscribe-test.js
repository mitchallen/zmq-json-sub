"use strict";

/* global describe, before, it, it, ... after */

var request = require('supertest'),
    should = require('should'),
    sleep = require('sleep'),
    config = require('./test-config'),
    ZmqJsonPub = require('zmq-json-pub'),
    ZmqJsonSub = require('../../zmq-json-sub'),
    service = config.service,
    publisher = config.publisher,
    subscriber = config.subscriber,
    pub = null,
    sub = null,
    lastMessage = null,
    lastTime = null;

describe('subscribe suite ' + config.versionLabel, function () {
    before(function () {
        pub = new ZmqJsonPub();
        pub.publish(publisher.endpoint);
        pub.verbose = config.verbose;
        var spec = {
            endpoint: subscriber.endpoint, 
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
        sub = new ZmqJsonSub(spec, function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
        });
        sub.verbose = config.verbose;
    });
    beforeEach(function() {
        lastMessage = null;
        lastTime = null;
    })
    it('should subscribe and receive a message', function (done) {
        let data = {
            message: 'this is a message',
            timestamp: Date.now()
        }
        pub.send(data);
        setTimeout(function () {
            should.exist(lastMessage);
            lastMessage.should.eql(data.message);
            should.exist(lastTime);
            lastTime.should.eql(data.timestamp);
            done();
        }, config.doneTimeout);
    });
    it('should not receive a message with no body', function (done) {
        pub.send();
        setTimeout(function () {
            should.not.exist(lastMessage);
            done();
        }, config.doneTimeout);
    });
    it('should not receive a message with null body and error callback', function (done) {
        var errCalled = false;
        pub.send(null, function(err) {
            errCalled = true;
            console.log(err);
        });
        errCalled.should.eql(true);
        setTimeout(function () {
            should.not.exist(lastMessage);
            done();
        }, config.doneTimeout);
    });
    after(function () {
        pub.close();
        sub.close();
    });
});