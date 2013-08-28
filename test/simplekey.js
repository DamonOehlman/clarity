var assert = require('assert'),
    Clarity = require('..'),
    clarity,
    testData = {
      'test': 'test',
      'this-is-a-test-key': 'test'
    };

describe('simple key replacement tests', function() {
    before(function() {
      clarity = new Clarity();
      clarity.use(testData);
    });

    it('should be able to replace a simple key', function() {
      assert.equal(clarity.decode('**test**'), 'test');
    });
    
    it('should be able to replace a simple key (with dashes)', function() {
      assert.equal(clarity.decode('**this-is-a-test-key**'), 'test');
    });
    
    it('should be able to replace occurrences of keys within other strings', function() {
      assert.equal(clarity.decode('T**test**'), 'Ttest');
    });
});