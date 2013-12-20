
/**
 * Module dependencies.
 */

var assert = require('assert');
var SSH = require('ssh2');

/**
 * Expose `Connection`.
 */

module.exports = Connection;

/**
 * SSH connection.
 *
 * @param {Object} [opts]
 * @api public
 */

function Connection(opts) {
  if (!(this instanceof Connection)) return new Connection(opts);
  this.ssh = new SSH;
  this.opts = opts;
  this.sessions = [];
}

/**
 * Connect with `opts`.
 *
 * - `host`
 * - `port`
 * - `user`
 * - `key`
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */

Connection.prototype.connect = function(opts){
  var ssh = this.ssh;
  opts = opts || this.opts || {};

  // default port
  opts.port = opts.port || 22;

  // required
  assert(opts.host, '.host required');
  assert(opts.user, '.user required');
  assert(opts.key, '.key required');
  opts.privateKey = opts.key;
  opts.username = opts.user;

  return function(done){
    ssh.connect(opts);
    ssh.once('ready', done);
    ssh.once('error', done);
  }
};

/**
 * Execute `cmd`.
 *
 * @param {String} cmd
 * @return {Function}
 * @api public
 */

Connection.prototype.exec = function(cmd){
  var ssh = this.ssh;
  return function(done){
    ssh.exec(cmd, function(err, stream){
      if (err) return done(err);
      var buf = '';
      stream.setEncoding('utf8');
      stream.on('data', function(c){ buf += c });
      stream.on('end', function(){ done(null, buf) });
    });
  }
};

/**
 * End the connection.
 *
 * @api public
 */

Connection.prototype.end = function(){
  this.ssh.end();
};
