var assert = require('assert'),
    clarity = require('..'),
    testData = {
      'test': 'test',
      'this-is-a-test-key': 'test'
    };

describe('object value replacement - deep', function() {
    before(function() {
      clarity.clear();
      clarity.use(testData);
    });

    it('should be able to replace a simple key', function() {
      var input = {
        name: '**test**',
        address: {
          street: '12 **this-is-a-test-key** Street',
          suburb: 'Brisbane'
        }
      };
      
      assert.deepEqual(clarity.decode(input), {
        name: 'test',
        address: {
          street: '12 test Street',
          suburb: 'Brisbane'
        }
      });
    });
});