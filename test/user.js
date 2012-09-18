var assert = require('assert'),
    clarity = require('..'),
    obfuscatedUrl = 'http://test:****@damonoehlman.iriscouch.com/clarity-tests',
    decodedUrl = 'http://test:test@damonoehlman.iriscouch.com/clarity-tests';

describe('username replacement tests', function() {
    before(clarity.clear);
    
    it('should return the same string when no secret stores have been created', function() {
        assert.equal(clarity.decode(obfuscatedUrl), obfuscatedUrl);
    });
    
    it('should be able to prime clarity with username / password keys', function() {
        clarity.use({
            TEST_PASS: 'test'
        });
    })
    
    it('should be able to decode the user string once it has valid keys', function() {
        assert.equal(clarity.decode(obfuscatedUrl), decodedUrl);
    });
});