var assert = require('assert'),
    clarity = require('..');

describe('object value replacement - shallow', function() {
    before(function() {
      clarity.clear();
      clarity.use(process.env);
    });

    it('should be able to replace an common environment variable (USER)', function() {
      assert.notEqual(clarity.decode('**USER**'), '**USER**');
    });

    it('should be able to replace an environment var within an object', function() {
      var data = clarity.decode({ username: '**USER** '});

      assert.notEqual(data.username, '**USER**');
    });

    it('should be able to replace an environment var with underscores', function() {
      var data = clarity.decode({ sshAgentPID: '**SSH_AGENT_PID**' });

      assert.notEqual(data.sshAgentPID, '**SSH_AGENT_PID**');
    });

    it('should be able to replace an environment var deep within an object', function() {
      var data = clarity.decode({
        config: {
          username: '**USER**'
        }
      });

      assert.notEqual(data.config.username, '**USER**');
    });
});