var test = require('tape');
var clarity = require('..');
var config;
var testData = {
  profile: {
    address: {
      street: 'test'
    }
  }
};

test('create clarity', function(t) {
  t.plan(1);
  t.ok(config = clarity(testData), 'created ok');
});

test('replace object values - nested', function(t) {
  var input = {
    name: '**profile.address.street**',
    address: {
      street: '12 **profile.address.street** Street',
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