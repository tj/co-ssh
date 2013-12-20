
var read = require('fs').readFileSync;
var ssh = require('..');
var co = require('co');

// make tests that other people
// can actually run :)

describe('ssh.exec(cmd)', function(){
  it('should execute a command', function(done){
    co(function *(){
      var c = ssh({
        host: '54.193.45.42',
        user: 'ec2-user',
        key: read(process.env.HOME + '/.ssh/segmentio-stage.pem')
      });

      yield c.connect();

      var str = yield c.exec('uptime');
      str.should.include('load average');

    })(done);
  })
})