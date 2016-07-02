"use strict";

var ZmqJsonSub = require('zmq-json-sub'),
    config = require('./config'),
    sub = null;

var spec = {
    endpoint: config.endpoint, 
    filter: "", 
    onMessage: function (data) {
        let jstring = JSON.parse(data);
        console.log( jstring );
        if (jstring.timestamp) {
            console.log( "TIME STAMP: [" 
                + new Date(jstring.timestamp) 
                + "]");
        }
    }
};

sub = new ZmqJsonSub(spec, function(err, data) {
    if (err) {
        console.log(err);
        return;
    }
});

console.log("Subscribed to: " + config.endpoint);

/*
    Handle termination - close sub.
*/

//  terminator === the termination handler.
function terminator(sig) {
   if (typeof sig === "string") {
      console.log('%s: Received %s - terminating Node server ...',
                  Date(Date.now()), sig);
      console.log("Closing subcriber before exit");
      sub.close();
      process.exit(1);
   }
   console.log('%s: Node server stopped.', Date(Date.now()) );
}

//  Process on exit and signals.
process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
});


