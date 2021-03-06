function Rules(linker, validator) {
    var self = this;
    
    var rules = function (value) {
        return self(value, function (_value) {
            return validator(_value);
        });
    }
    
    Object.defineProperty(rules, 'or', {
        get: function () {
            var or = function (valueOrRules, next) {
                if (typeof next === 'function') {
                    return rules(valueOrRules) || (linker.__type__(valueOrRules) && next(valueOrRules));
                }
                return Rules.call(function (value, next) {
                    return rules(value) || next(value);
                }, null, valueOrRules);
            }
            if (linker)
                linker.call(or)
            return or
        }
    })
    
    Object.defineProperty(rules, 'and', {
        get: function () {
            var and = function (valueOrRules, next) {
                if (typeof next === 'function') {
                    return rules(valueOrRules) && next(valueOrRules);
                }
                return Rules.call(and, null, valueOrRules);
            }
            if (linker)
                linker.call(and);
            return and
        }
    })
    
    return rules;
}

module.exports = Rules;