var assert = require('assert'),
    clarity = require('..'),
    testData = {
      'profile': {
        'address': {
          'street': 'test'
        }
      }
    };

describe('object value replacement - nested data', function() {
    before(function() {
      clarity.clear();
      clarity.use(testData);
    });

    it('should be able to replace a key from a nested data source', function() {
      var input = {
        name: '**profile.address.street**',
        address: {
          street: '12 **profile.address.street** Street',
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