const hydrator = require('./index.js');
const assert = require('assert');


describe('Decarator', function () {
    it('should track properties that', function () {
        class testClass {
            @hydrator.managedRef
            testProperty1;
            @hydrator.managedRef
            testProperty2;
            @hydrator.managedRef
            testProperty3;
        };

        const testObj = new testClass();
    });
});

describe('hydrate', function () {
    it('should inflate all refereneces by value', function () {

    });

    it('should inflate references by decarator', function () {

    })



});


describe('dehydrate', function () {
    it('should deflate all references in nested objects', function () {


    });

    it('should not loop forever in deeply nested objects', function () {


    });

});