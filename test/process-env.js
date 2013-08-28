var test = require('tape');
var clarity = require('..');
var config;

test('create clarity', function(t) {
  t.plan(1);
  t.ok(config = clarity(process.env), 'created ok');
});

test('replace an common environment variable (USER)', function(t) {
  t.plan(1);
  t.notEqual(config.decode('**USER**'), '**USER**');
});

test('replace an environment var within an object', function(t) {
  t.plan(1);
  t.notEqual(config.decode({ username: '**USER**' }).username, '**USER**');
});

test('replace an environment var with underscores', function(t) {
  t.plan(1);
  t.notEqual(config.decode({ sshAgentPID: '**SSH_AGENT_PID**' }).sshAgentPID, '**SSH_AGENT_PID**');
});

test('object value replacement - shallow', function(t) {
  t.plan(1);
  t.notEqual(config.decode({
    config: {
      username: '**USER**'
    }
  }).config.username, '**USER**');
});