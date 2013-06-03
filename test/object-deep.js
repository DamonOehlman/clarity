var assert = require('assert'),
    Clarity = require('..'),
    clarity,
    testData = {
      'test': 'test',
      'this-is-a-test-key': 'test'
    };

describe('object value replacement - deep', function() {
    before(function() {
      clarity = new Clarity();
      clarity.use(testData);
    });

    it('should be able to replace a simple key', function() {
      var input = {
        name: '**test**',
        address: {
          street: '12 **this-is-a-test-key** Street',
          suburb: 'Brisbane',
          postcode: 4054
        }
      };
      
      assert.deepEqual(clarity.decode(input), {
        name: 'test',
        address: {
          street: '12 test Street',
          suburb: 'Brisbane',
          postcode: 4054
        }
      });
    });
});