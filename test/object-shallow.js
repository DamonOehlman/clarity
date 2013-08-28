var test = require('tape');
var clarity = require('..');
var config;
var testData = {
  'test': 'test',
  'this-is-a-test-key': 'test',
  'this_is_another_test_key': 'test'
};

test('create clarity', function(t) {
  t.plan(1);
  t.ok(config = clarity(testData), 'created ok');
});

test('replace a simple key', function(t) {
  t.plan(1);
  t.deepEqual(config.decode({ name: '**test**' }), { name: 'test' });
});

test('replace a simple key (with dashes)', function(t) {
  t.plan(1);
  t.deepEqual(
    config.decode({ name: '**this-is-a-test-key**' }),
    { name: 'test' }
  );
});

test('replace a simple key (with underscores)', function(t) {
  t.plan(1);
  t.deepEqual(
    config.decode({ name: '**this_is_another_test_key**'}),
    { name: 'test' }
  );
});

test('replace occurrences of keys within other strings', function(t) {
  t.plan(1);
  t.deepEqual(config.decode({ name: 'T**test**' }), { name: 'Ttest' });
});