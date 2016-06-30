/**
Auhor: Mitch Allen
 */

"use strict";

var zmq = require('zmq');

function ZmqJsonSub(spec) {
    this.name    = require("./package").name;
    this.version = require("./package").version;
    this.subscribe(spec);
}

module.exports = ZmqJsonSub;

ZmqJsonSub.prototype.verbose = false;

ZmqJsonSub.prototype.subscribe = function (spec) {
    if (!spec.endpoint) {
        if (this.verbose) {
            console.error("ERROR: subscribe path not defined");
        }
        return false;
    }
    if (!spec.function) {
        if (this.verbose) {
            console.error("ERROR: subscribe function not defined");
        }
        return false;
    }
    this.subscriber = zmq.socket('sub');
    var filter = spec.filter || "";
    this.subscriber.subscribe(filter);
    this.subscriber.on("message", spec.function);
    // Example: tcp://localhost:5432
    console.log("subscribing on: " + spec.endpoint);
    this.subscriber.connect(spec.endpoint);
    return true;
};

ZmqJsonSub.prototype.close = function () {
    this.subscriber.close();
};
