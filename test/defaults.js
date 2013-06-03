var assert = require('assert'),
    Clarity = require('..'),
    clarity,
    testData = {};

describe('default value usage', function() {
    before(function() {
      clarity = new Clarity();
      clarity.use(testData);
    });

    it('should be able to replace a simple key', function() {
      var input = {
        name: '**test|Roger Rabbit**',
        address: {
          street: '12 **this-is-a-test-key|** Street',
          suburb: 'Brisbane',
          postcode: 4054
        }
      };
      
      assert.deepEqual(clarity.decode(input), {
        name: 'Roger Rabbit',
        address: {
          street: '12  Street',
          suburb: 'Brisbane',
          postcode: 4054
        }
      });
    });
});