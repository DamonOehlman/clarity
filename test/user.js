var test = require('tape');
var clarity = require('..');
var config;
var obfuscatedUrl = 'http://test:****@damonoehlman.iriscouch.com/clarity-tests';
var decodedUrl = 'http://test:test@damonoehlman.iriscouch.com/clarity-tests';

test('create clarity', function(t) {
  t.plan(1);
  t.ok(config = clarity(), 'created');
});

test('return the same string when no secret stores have been created', function(t) {
  t.plan(1);
  t.equal(config.decode(obfuscatedUrl), obfuscatedUrl);
});

test('tell the config to use some additional data', function(t) {
  t.plan(1);
  config.use({ test_pass: 'test' });
  t.equal(config.data.test_pass, 'test');
});

test('can decode the user string', function(t) {
  t.plan(1);
  t.equal(config.decode(obfuscatedUrl), decodedUrl);
});