/**
Auhor: Mitch Allen
 */

"use strict";

var zmq = require('zmq');

function ZmqJsonSub(spec, callback) {
    this.name    = require("./package").name;
    this.version = require("./package").version;
    this.subscribe(spec, callback);
}

module.exports = ZmqJsonSub;

ZmqJsonSub.prototype.subscribe = function (spec, callback) {
    if (callback && typeof callback === "function") {
        if (!spec) {
            callback(new Error("subscribe called with no arguments"));
            return;
        }
        if (!spec.endpoint) {
            callback(new Error("subscribe endpoint not defined"));
            return;
        }
        if (!spec.onMessage) {
            callback(new Error("subscribe onMessage function not defined"));
            return;
        }
    }
    this.subscriber = zmq.socket('sub');
    var filter = spec.filter || "";
    this.subscriber.subscribe(filter);
    this.subscriber.on("message", spec.onMessage);
    this.subscriber.connect(spec.endpoint);
};

ZmqJsonSub.prototype.close = function () {
    this.subscriber.close();
};
