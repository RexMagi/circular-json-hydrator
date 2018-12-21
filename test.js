const hydrator = require('./index.js');
const sinon = require('sinon');
const assert = require('chai').assert;

describe('hydrate', function () {
    it('should inflate sibling objects', function () {
        const testObject = {
            prop1: {
                id: 1
            },
            prop2: 1
        };
        const expectedObject = {
            prop1: {
                id: 1
            }
        };
        expectedObject.prop2 = expectedObject.prop1;
        const result = hydrator.hydrateObject(testObject, "id");

        assert.deepEqual(expectedObject, result);

    });

    it('should inflate objects nested in objects', function () {
        const testObject = {
            prop1: {
                id: 3
            },
            prop2: {
                id: 4,
                prop21: 3
            }

        };

        const expectedObject = {
            prop1: {
                id: 3
            },
            prop2: {
                id: 4,

            }
        };
        expectedObject.prop2.prop21 = expectedObject.prop1;

        const result = hydrator.hydrateObject(testObject, "id");

        assert.deepEqual(result, expectedObject);

    });

    it('should inflate objects nested in arrays', function () {
        const testObject = {
            prop1: {
                id: 1
            },
            prop2: [1, 1, 1]
        };

        const expectedObject = {
            prop1: {
                id: 1
            }
        };
        expectedObject.prop2 = [];

        expectedObject.prop2.push(expectedObject.prop1);
        expectedObject.prop2.push(expectedObject.prop1);
        expectedObject.prop2.push(expectedObject.prop1);

        const result = hydrator.hydrateObject(testObject, "id");

        assert.deepEqual(result, expectedObject);

    });

    it('should not change the orginal object', function () {
        const testObject = {
            prop1: {
                id: 1
            },
            prop2: 1
        };

        const expectedObject = {
            ...testObject
        };

        const result = hydrator.hydrateObject(testObject, "id");

        assert.deepEqual(testObject, expectedObject);

    });

    it('should inflate references by decarator', function () {

    });




});


describe('dehydrate', function () {

    it('should deinflate objects nested in objects', function () {
        const testObject = {
            prop1: {
                id: 3
            },
            prop2: {
                id: 4,
                prop1: {
                    id: 3
                }
            }

        };

        const expectedObject = {
            prop1: {
                id: 3
            },
            prop2: {
                id: 4,
                prop1: 3
            }
        };

        const result = hydrator.dehydrateObject(testObject, "id");

        assert.deepEqual(result, expectedObject);

    });

    it('should deinflate objects nested in arrays', function () {
        const testObject = {
            prop1: {
                id: 1
            },
            prop2: []
        };

        testObject.prop2.push(testObject.prop1);

        const expectedObject = {
            prop1: {
                id: 1
            },
            prop2: [1]
        };

        const result = hydrator.dehydrateObject(testObject, "id");

        assert.deepEqual(result, expectedObject);

    });

    it('should not change the orginal object', function () {
        const testObject = {
            prop1: {
                id: 1
            },
            prop2: {
                id: 2
            }
        };

        const expectedObject = {
            ...testObject
        };

        const result = hydrator.dehydrateObject(testObject, "id");

        assert.deepEqual(testObject, expectedObject);

    });

});