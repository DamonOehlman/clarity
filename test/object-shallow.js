var assert = require('assert'),
    clarity = require('..'),
    testData = {
      'test': 'test',
      'this-is-a-test-key': 'test'
    };

describe('object value replacement - shallow', function() {
    before(function() {
      clarity.clear();
      clarity.use(testData);
    });

    it('should be able to replace a simple key', function() {
      assert.deepEqual(clarity.decode({ name: '**test**' }), { name: 'test' });
    });

    it('should be able to replace a simple key (with dashes)', function() {
      assert.deepEqual(clarity.decode({ name: '**this-is-a-test-key**' }), { name: 'test' });
    });

    it('should be able to replace occurrences of keys within other strings', function() {
      assert.deepEqual(clarity.decode({ name: 'T**test**' }), { name: 'Ttest' });
    });
});