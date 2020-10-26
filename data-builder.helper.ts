import * as _ from 'lodash';

export class ConcatValueChanger  {
    static getValue(keyNames, obj) {
        return _.reduce(keyNames, function(newValue, key) {
            return _.includes(_.keys(obj),key) ? newValue.concat(obj[key]) : newValue.concat(key);
        }, '');
    }
}