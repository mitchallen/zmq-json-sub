"use strict";

var config = {};

config.publisher = {};
config.publisher.endpoint = "tcp://*:5431";

config.subscriber = {};
config.subscriber.endpoint = "tcp://localhost:5431";

config.logVersion = "00-01";  // Used in log name.
config.versionLabel = " [" + config.logVersion + "]"; // Used in test labels.

config.doneTimeout = 500;

config.verbose = true; 

module.exports = config;