var test = require('tape');
var clarity = require('..');
var config;
var input = {
  name: '**test|Roger Rabbit**',
  address: {
    street: '12 **this-is-a-test-key|** Street',
    suburb: 'Brisbane',
    postcode: 4054
  }
};

test('create clarity', function(t) {
  t.plan(1);
  t.ok(config = clarity(), 'created ok');
});

test('replace a simple key with a default value', function(t) {
  t.plan(1);
  t.deepEqual(config.decode(input), {
    name: 'Roger Rabbit',
    address: {
      street: '12  Street',
      suburb: 'Brisbane',
      postcode: 4054
    }
  });
});