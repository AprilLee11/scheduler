import { Injectable } from '@angular/core';

@Injectable()
export class EventTemporaryDataService {

    constructor() {

    }

    get EventDate() {
        return '8/16/2020, 8:00:00 AM';
    }

    get EndDate() {
        return '8/16/2020, 8:30:00 AM';
    }

    get NeedAssistance() {
        return 'False';
    }

    get EventOwner() {
        return {Refs: [{Id: 103, Value: "Mikyung Lee", UserName: null}]};
    }
    
    get Instrument() {
        return {Refs: [{Id: 1101, Value: "Hamamatsu Nanozoomer"}]};
    }
}