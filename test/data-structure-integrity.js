var test = require('tape');
var clarity = require('..');
var testData = {
  name: 'test'
};
var config;

test('initialise data store', function(t) {
  t.plan(1);
  config = clarity(testData);
  t.ok(config, 'created clarity instance');
});

test('should preserve arrays', function(t) {
  var input = {
    name: '**name**',
    animals: [
      { name: 'Cat' },
      { name: 'Dog' },
      { name: 'Lion' }
    ]
  };

  t.plan(1);
  t.deepEqual(config.decode(input), {
    name: 'test',
    animals: [
      { name: 'Cat' },
      { name: 'Dog' },
      { name: 'Lion' }
    ]
  }, 'arrays preserved');
});