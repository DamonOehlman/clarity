var test = require('tape');
var clarity = require('..');
var config;
var testData = {
  'test': 'test',
  'this-is-a-test-key': 'test'
};

test('create clarity', function(t) {
  t.plan(1);
  t.ok(config = clarity(testData), 'created ok');
});

test('replace a simple key within an object', function(t) {
  var input = {
    name: '**test**',
    address: {
      street: '12 **this-is-a-test-key** Street',
      suburb: 'Brisbane',
      postcode: 4054
    }
  };
  
  t.plan(1);
  t.deepEqual(config.decode(input), {
    name: 'test',
    address: {
      street: '12 test Street',
      suburb: 'Brisbane',
      postcode: 4054
    }
  });
});