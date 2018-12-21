module.exports = (function () {
    const decaratorMap = new Map();
    module.managedRef = function (target, property, descriptor) {
        const className = target.constructor.name;
        let perpertySet = new Set();

        if (decaratorMap.has(className)) {
            perpertySet = decaratorMap.get(className);
        } else {
            decaratorMap.set(className, perpertySet);
        }

        if (!perpertySet.has(property)) {
            perpertySet.add(property);
        }

        return descriptor;
    }


    module.hydrateObject = function (obj, referenceIdProperty) {
        const newInstance = {};
        const cache = new Map();
        const delayedInitilzerFunctionsArray = [];
        for (const prop in obj) {
            if (Array.isArray(obj[prop])) {
                newInstance[prop] = hydrateArray(obj[prop], cache, delayedInitilzerFunctionsArray, referenceIdProperty);
            } else if (typeof obj[prop] === 'object') {
                newInstance[prop] = hydrateNestedObject(obj[prop], cache, delayedInitilzerFunctionsArray, referenceIdProperty);
            } else {
                delayedInitilzerFunctionsArray.push(() => {
                    if (cache.has(obj[prop])) {
                        newInstance[prop] = cache.get(obj[prop]);
                    } else {
                        newInstance[prop] = obj[prop];
                    }
                });
            }
        }

        for (const func of delayedInitilzerFunctionsArray) {
            func();
        }

        return newInstance;
    };

    function hydrateArray(arr, cache, delayedInitilzerFunctionsArray, referenceIdProperty) {
        const newArr = [];
        for (const obj of arr) {
            if (Array.isArray(obj)) {
                newArr.push(hydrateArray(arr, delayedInitilzerFunctionsArray, referenceIdProperty));
            } else if (typeof obj === 'object') {
                newArr.push(hydrateNestedObject(obj, delayedInitilzerFunctionsArray, referenceIdProperty));
            } else {
                delayedInitilzerFunctionsArray.push(() => {
                    if (cache.has(obj)) {
                        newArr.push(cache.get(obj));
                    } else {
                        newArr.push(obj);
                    }
                });
            }

        }

        return newArr;
    }

    function hydrateNestedObject(obj, cache, delayedInitilzerFunctionsArray, referenceIdProperty) {

        const newInstance = {};

        for (const prop in obj) {
            if (Array.isArray(obj[prop])) {
                newInstance[prop] = hydrateArray(obj[prop], cache, delayedInitilzerFunctionsArray, referenceIdProperty);
            } else if (typeof obj[prop] === 'object') {
                newInstance[prop] = hydrateNestedObject(obj[prop], cache, delayedInitilzerFunctionsArray, referenceIdProperty);
            } else {
                delayedInitilzerFunctionsArray.push(() => {
                    if (cache.has(obj[prop]) && referenceIdProperty !== prop) {
                        newInstance[prop] = cache.get(obj[prop]);
                    } else {
                        newInstance[prop] = obj[prop];
                    }
                });
            }
        }

        if (obj.hasOwnProperty(referenceIdProperty) && !cache.has(obj[referenceIdProperty])) {
            cache.set(obj[referenceIdProperty], newInstance);
        }
        return newInstance;
    }

    module.dehydrateObject = function (obj, referenceIdProperty) {
        const cache = new Map();
        const newInstance = {};
        for (const prop in obj) {
            if (Array.isArray(obj[prop])) {
                newInstance[prop] = dehydrateArray(obj[prop], delayedInitilzerFunctionsArray, referenceIdProperty);
            } else if (typeof obj[prop] === 'object') {
                newInstance[prop] = dehydrateNestedObject(obj[prop], delayedInitilzerFunctionsArray, referenceIdProperty);
            } else {
                newInstance[prop] = obj[prop];
            }
        }

    };


    return module;

}());

