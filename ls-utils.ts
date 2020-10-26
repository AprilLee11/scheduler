import * as _ from 'lodash';

import { Property } from './models';
import { Constants } from './constants';

export class Util {
    static getValueByKey (key: string, properties: Property[]) : string | object {
        const property = _.find(properties, (property) => key === property.internalName);
        if(property.value) {
            if(_.isString(property.value)) {
                return property.value;
            } else if (_.isObject(property.value) && _.isArray(property.value.Refs) && property.value.Refs[0] && property.value.Refs.length > 0) {
                return property.value.Refs[0];
            }
        }
        return undefined;
    }

    static setValueByKey (key: string, value: string | object, properties: Property[]) {
        const property = _.find(properties, (property) => key === property.internalName);
        !_.isObject(property.value) ? property.value = value : property.value.Refs[0] = value;
    }

    static getIdFromProperty (property: Property): number {
        if(property.value && property.value.Refs[0] && _.isArray(property.value.Refs) && property.value.Refs.length > 0) {
            return property.value.Refs[0].Id;            
        } else {
            return undefined;
        }
    }
}

// temporary should be configurable as environemental variables
export class LSUrlBuilder {
    static getBaseUrl(): string {
        return [Constants.DOMAIN, Constants.VERSION, Constants.FACILITY_ID].join('/');
    }

    static getViewUrl(listName: string, viewName: string): string {
        return [LSUrlBuilder.getBaseUrl(), Constants.FACILITY, Constants.LIST, listName, Constants.VIEW, viewName].join('/');
    };

    static getItemUrl(listName: string, id: string): string {
        return [LSUrlBuilder.getBaseUrl(), Constants.FACILITY, Constants.LIST, listName, Constants.ITEM, id].join('/');
    }

    static updateUrl(listName: string, id: string): string {
        return [LSUrlBuilder.getBaseUrl(), Constants.FACILITY, Constants.LIST, listName, Constants.ITEM, id].join('/');
    }

    static deleteUrl(listName: string, id: string): string {
        return [LSUrlBuilder.getBaseUrl(), Constants.FACILITY, Constants.LIST, listName, Constants.ITEM, id].join('/');
    }

    static getNewUrl(listName: string): string {
        return [LSUrlBuilder.getBaseUrl(), Constants.FACILITY, Constants.LIST, listName, Constants.NEW].join('/');
    }

    static createUrl(listName: string): string {
        return [LSUrlBuilder.getBaseUrl(), Constants.FACILITY, Constants.LIST, listName, Constants.ITEM].join('/');
    }
}
