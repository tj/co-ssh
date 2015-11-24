
# co-ssh

  SSH client for generators.

## Installation

```
$ npm install co-ssh
```

## Example

```js
var co = require('co');
var ssh = require('co-ssh');

...
var c = ssh({
  host: 'n.n.n.n',
  user: 'myuser',
  key: read(process.env.HOME + '/.ssh/some.pem')
});

co(function *() {
  yield c.connect();
  
  console.log(yield c.exec('pwd'));
  
  var ls = yield c.exec('ls -l');
  console.log(ls);
});
...
```

### Example using plain-text authentication
Simply replace `key` option with `password`

```js
...
var c = ssh({
  host: 'n.n.n.n',
  user: 'myuser',
  password: 'mypass'
});
...

```

# License

  MIT