var assert = require('assert'),
    clarity = require('..'),
    testData = {
      name: 'test'
    };

describe('default value usage', function() {
    before(function() {
      clarity.clear();
      clarity.use(testData);
    });

    it('should be able to replace a simple key', function() {
      var input = {
        name: '**name**',
        animals: [
          { name: 'Cat' },
          { name: 'Dog' },
          { name: 'Lion' }
        ]
      };

      assert.deepEqual(clarity.decode(input), {
        name: 'test',
        animals: [
          { name: 'Cat' },
          { name: 'Dog' },
          { name: 'Lion' }
        ]
      });
    });
});