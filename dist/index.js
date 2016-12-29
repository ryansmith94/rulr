"use strict";
exports.pathString = function (path) {
    return "`" + path.join('.') + "`";
};
exports.warn = function (msg) {
    if (msg === void 0) { msg = 'Problem'; }
    return function (path) {
        return msg + " in " + exports.pathString(path);
    };
};
exports.composeRules = function (rules) { return function (data, path) {
    return rules.reduce(function (warnings, rule) {
        return warnings.concat(rule(data, path));
    }, []);
}; };
exports.first = function (preReq, postReq) { return function (data, path) {
    var preReqWarnings = preReq(data, path);
    if (preReqWarnings.length > 0)
        return preReqWarnings;
    return postReq(data, path);
}; };
exports.checkBoolWarning = function (data) {
    return exports.warn();
};
exports.checkBool = function (checker, warning) {
    if (warning === void 0) { warning = exports.checkBoolWarning; }
    return function (data, path) {
        return checker(data) ? [] : [warning(data)(path)];
    };
};
exports.checkThrowWarning = function (data, ex) {
    return exports.warn(ex.message);
};
exports.checkThrow = function (checker, warning) {
    if (warning === void 0) { warning = exports.checkThrowWarning; }
    return function (data, path) {
        try {
            checker(data);
            return [];
        }
        catch (ex) {
            return [warning(data, ex)(path)];
        }
    };
};
exports.typeWarning = function (type) { return function (data) {
    return exports.warn("`" + JSON.stringify(data) + "` is not a valid " + type);
}; };
exports.checkType = function (type, warning) {
    if (warning === void 0) { warning = exports.typeWarning; }
    return function (data, path) { return (data === undefined || data === null || data.constructor !== type ?
        [warning(type.name)(data)(path)] :
        []); };
};
exports.checkRegexWarning = function (data) {
    return exports.warn();
};
exports.checkRegex = function (regex, regexWarning, stringError) {
    if (regexWarning === void 0) { regexWarning = exports.checkRegexWarning; }
    return exports.first(exports.checkType(String, stringError), function (data, path) {
        return regex.test(data) ? [] : [regexWarning(data)(path)];
    });
};
exports.optional = function (rule) { return function (data, path) {
    return data === undefined ? [] : rule(data, path);
}; };
exports.missingKeyWarning = exports.warn('Missing required value');
exports.required = function (rule, warning) {
    if (warning === void 0) { warning = exports.missingKeyWarning; }
    return function (data, path) {
        return data === undefined ? [warning(path)] : rule(data, path);
    };
};
exports.invalidKeyWarning = function (invalidKeys) {
    return exports.warn("Invalid keys `" + invalidKeys.join('\`, \`') + "` found");
};
exports.restrictToKeys = function (keys, warning, objectWarning) {
    if (warning === void 0) { warning = exports.invalidKeyWarning; }
    return exports.first(exports.checkType(Object, objectWarning), function (data, path) {
        var invalidKeys = Object.keys(data).filter(function (key) {
            return keys.indexOf(key) === -1;
        });
        return invalidKeys.length === 0 ? [] : [warning(invalidKeys)(path)];
    });
};
exports.hasSchema = function (schema, objectWarning) {
    return exports.first(exports.checkType(Object, objectWarning), function (data, path) {
        return Object.keys(schema).reduce(function (warnings, key) {
            return warnings.concat(schema[key](data[key], path.concat([key])));
        }, []);
    });
};
exports.restrictToSchema = function (schema, objectWarning, invalidKeyWarning) {
    return exports.first(exports.checkType(Object, objectWarning), exports.composeRules([
        exports.hasSchema(schema),
        exports.restrictToKeys(Object.keys(schema), invalidKeyWarning),
    ]));
};
exports.restrictToCollection = function (rule, arrayWarning) {
    return exports.first(exports.checkType(Array, arrayWarning), function (data, path) {
        return data.reduce(function (warnings, elem, index) {
            return warnings.concat(rule(index)(elem, path.concat(["" + index])));
        }, []);
    });
};
