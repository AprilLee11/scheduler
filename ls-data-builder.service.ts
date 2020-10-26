import * as _ from 'lodash';

import { DataBuilder } from './data-builder';
import { IItems } from '@labshare/facility-base/dist/models/interfaces';

export class LSDataBuilder extends DataBuilder<IItems> {

    constructor(data, keys) {
        super(data, keys);
    }

    createData() {
        _.each(this.data, item => {
            const obj = {};
            _.each(item.Properties, property => {
                if(_.includes(this.keys, property['internalName'])) {
                    obj[property['internalName']] = property['value']
                }
            });
            this.lsData.push(obj);
        });
        return this;
    };

    normalizeByValue(keyNames) {
        this.lsData = _.map(this.lsData, function(obj) {
            _.each(keyNames, function(keyName) {
                obj[keyName] = _.has(obj[keyName], 'Refs[0].Value') ? obj[keyName].Refs[0].Value : null;
            });
            return obj;
        })
        return this;
    };
}

