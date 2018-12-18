const decaratorMap = new Map();
exports.managedRef = function (target, property, descriptor) {
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


exports.hydrateObject = function (obj, referenceIdProperty) {
    const newInstance = {};
    const cache = new Map();
    const delayedInitilzerFunctionsArray = [];
    for (prop in obj) {
        if (Array.isArray(obj[prop])) {
            newInstance[prop] = hydrateArray(obj[prop], delayedInitilzerFunctionsArray, referenceIdProperty);
        } else if (typeof obj[prop] === 'object') {
            newInstance[prop] = hydrateNestedObject(obj[prop], delayedInitilzerFunctionsArray, referenceIdProperty);
        } else {
            if (prop === referenceIdProperty) {
                delayedInitilzerFunctionsArray.push(() => {
                    if (cache.has(obj[prop])) {
                        newInstance[prop] = cache.get(obj[prop]);
                    } else {
                        newInstance[prop] = obj[prop];
                    }
                });
            }
        }
    }

    for (func of delayedInitilzerFunctionsArray) {
        func();
    }

    return newInstance;
};

function hydrateArray(arr, delayedInitilzerFunctionsArray, referenceIdProperty) {
    const newArr = [];
    for (obj of arr) {
        if (Array.isArray(obj)) {
            newArr.push(hydrateArray(arr, delayedInitilzerFunctionsArray, referenceIdProperty));
        } else if (typeof obj === 'object') {
            newArr.push(hydrateNestedObject(obj, delayedInitilzerFunctionsArray, referenceIdProperty));
        } else {
            if (prop === referenceIdProperty) {
                delayedInitilzerFunctionsArray.push(() => {
                    if (cache.has(obj[prop])) {
                        newArr.push(cache.get(obj[prop]));
                    } else {
                        newArr.push(obj[prop]);
                    }
                });
            }
        }
    }

    return newArr;
}

function hydrateNestedObject() {


}

exports.dehydrateObject = function (obj, referenceIdProperty) {
    const cache = new Map();
    const newInstance = {};
    for (prop in obj) {
        if (Array.isArray(obj[prop])) {
            newInstance[prop] = dehydrateArray(obj[prop], delayedInitilzerFunctionsArray, referenceIdProperty);
        } else if (typeof obj[prop] === 'object') {
            newInstance[prop] = dehydrateNestedObject(obj[prop], delayedInitilzerFunctionsArray, referenceIdProperty);
        } else {
            newInstance[prop] = obj[prop];
        }
    }

};
