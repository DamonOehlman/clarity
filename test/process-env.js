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
});