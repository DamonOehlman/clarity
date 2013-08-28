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

test('replace a simple key', function(t) {
  t.plan(1);
  t.equal(config.decode('**test**'), 'test');
});

test('replace a simple key (with dashes)', function(t) {
  t.plan(1);
  t.equal(config.decode('**this-is-a-test-key**'), 'test');
});

test('replace occurrences of keys within other strings', function(t) {
  t.plan(1);
  t.equal(config.decode('T**test**'), 'Ttest');
});