
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
 * - `port` defaults to 22
 * - `user`
 * - `key` for private-key or `password` for plain-text
 * - `encoding` defaults to 'ascii' (a bit faster than 'utf8' if you sure you don't need to handle fancy chars)
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
  
  // default encoding
  this.encoding = opts.encoding || 'ascii'

  // required
  assert(opts.host, '.host required');
  assert(opts.user, '.user required');
  assert(opts.key || opts.password, '.key or .password required');
  
  opts.username = opts.user;
  
  if (opts.key) {
    opts.privateKey = opts.key;
  }
  else if (opts.password) {
    opts.tryKeyboard = true;
  }

  return new Promise(function(resolve, reject) {
    ssh.connect(opts);
    ssh.once('keyboard-interactive', function() { arguments[4]([opts.password]) });
    ssh.once('ready', resolve);
    ssh.once('error', reject);
  });
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

  return new Promise(function(resolve, reject) {
    ssh.exec(cmd, function(err, stream){
      if (err) return reject(err);
      
      var buf = [];
      stream.setEncoding(this.encoding);
      stream.on('data', function(c){ buf.push(c) });
      stream.on('end', function(){ resolve(buf.join('')) });
      stream.stderr.on('data', function(data) { reject(data + '') });
    });
  });
};

/**
 * End the connection.
 *
 * @api public
 */

Connection.prototype.end = function(){
  this.ssh.end();
};
