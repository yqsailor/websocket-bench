/*global module, require*/
var io       = require('socket.io-client'),
  util       = require('util'),
  BaseWorker = require('./baseworker.js'),
  logger     = require('../logger.js');

/**
 * SocketIOWorker Worker class inherits form BaseWorker
 */
var SocketIOWorker = function (server, generator) {
  SocketIOWorker.super_.apply(this, arguments);
};

util.inherits(SocketIOWorker, BaseWorker);

SocketIOWorker.prototype.createClient = function (callback) {
  var self = this;
  var client = io.connect(this.server, Object.assign({ 'force new connection' : true}, this.generator.options));

  client.on('connect', function () {
    callback(false, client);
  });

  client.on('connect_error', function (err) {
    if (self.verbose) {
      try {
        err = JSON.stringify(err);
      } catch (e) {
        err = JSON.stringify({
          message: err.message,
          type: err.type,
          description: err.description && err.description.toString()
        });
      }
      logger.error("SocketIO Worker connect_failed: " + err);
    }
    callback(true, client);
  });

  client.on('error', function (err) {
    console.log('err')
    if (self.verbose) {
      try {
        err = JSON.stringify(err);
      } catch (e) {
        err = JSON.stringify({
          message: err.message,
          type: err.type,
          description: err.description
        });
      }
      logger.error("SocketIO Worker error: " + err);
    }
    callback(true, client);
  });
};

module.exports = SocketIOWorker;
