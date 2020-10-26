import * as _ from 'lodash';
import { ChangeKeyInput } from './models';
import { ConcatValueChanger } from './data-builder.helper';

export abstract class DataBuilder<T> {
    lsData: object[] = [];
    data: T;
    keys: string[];

    constructor(data: T, keys: string[]) {
        this.data = data;
        this.keys = keys;
    }

    public changeKey(keyNames: ChangeKeyInput[]) {
        const oldKeys = _.map(keyNames, 'oldKey');
        this.lsData = _.map(this.lsData, function(obj) {
            return _.mapKeys(obj, function(value, key) {
                if(_.includes(oldKeys, key)) {
                    return (_.find(keyNames, function(o) { return o.oldKey === key })).newKey;
                } else {
                    return key;
                }
            })
        });
        return this;
    }

    public changeValue(keyName: string, command: string, keyNames: string[]) {
        this.lsData = _.map(this.lsData, function(obj) {
            switch(command) {
                case 'concat': { 
                    obj[keyName] = ConcatValueChanger.getValue(keyNames, obj);
                    break;
                }
                default: { 
                    break;
                } 
            }
            return obj;
        })
        return this;
    }

    public changeTypeToDate(keyNames: string[]) {
        this.lsData = _.map(this.lsData, function(obj) {
            _.each(keyNames, function(keyName) {
                obj[keyName] = new Date(obj[keyName]);
            });
            return obj;
        })
        return this;
    }

    public changeTypeToNumber(keyNames: string[]) {
        this.lsData = _.map(this.lsData, function(obj) {
            _.each(keyNames, function(keyName) {
                obj[keyName] = Number(obj[keyName]);
            });
            return obj;
        })
        return this;
    }

    public sort(key: string) {
        this.lsData = _.sortBy(this.lsData, key);
        return this;
    }

    public build() {
        return this.lsData;
    }

    abstract createData(): this;
}