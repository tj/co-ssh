
# co-ssh

  SSH client for generators.

## Installation

```
$ npm install co-ssh
```

## Example

```js
var ssh = require('co-ssh');

...
var c = ssh({
  host: 'n.n.n.n',
  user: 'myuser',
  key: read(process.env.HOME + '/.ssh/some.pem')
});

yield c.connect();
yield c.exec('foo');
yield c.exec('bar');
yield c.exec('baz');
...
```

# License

  MIT