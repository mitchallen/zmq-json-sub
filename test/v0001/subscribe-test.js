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
    lastType = null,
    lastMessage = null;

describe('subscribe suite ' + config.versionLabel, function () {
    before(function () {
        pub = new ZmqJsonPub();
        pub.publish(publisher.endpoint);
        sub = new ZmqJsonSub({
            endpoint: subscriber.endpoint, 
            filter: "", 
            function: function (data) {
                if (config.verbose) {
                    console.log("DATA: " + data);
                }
                let jstring = JSON.parse(data);
                lastMessage = jstring.message
                // var date = new Date(jstring.timestamp);
                // console.log("DATE STAMP: " + date);
                // console.log("MESSAGE: " + JSON.stringify(jstring));
            }
        });
        sub.verbose = config.verbose;
    });
    beforeEach(function() {
        lastType = null;
        lastMessage = null;
    })
    it('should subscribe to message', function (done) {
        let data = {
            message: 'message from ok 1',
            timestamp: Date.now()
        }
        let result = pub.send(data);
        result.should.eql(true);
        setTimeout(function () {
            should.exist(lastMessage);
            lastMessage.should.eql(data.message);
            done();
        }, config.doneTimeout);
    });
    it('should not receive to message with no body', function (done) {
        let result = pub.send();
        result.should.eql(false);
        setTimeout(function () {
            should.not.exist(lastType);
            should.not.exist(lastMessage);
            done();
        }, config.doneTimeout);
    });
    after(function () {
        pub.close();
        sub.close();
    });
});