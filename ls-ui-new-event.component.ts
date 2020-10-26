import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { CalendarStoreService } from './calendar-store.service';
import { IItems, IItem } from '@labshare/facility-base/dist/models/interfaces';
import { EventActionSubjectData } from './models';
import { CalendarApiService } from './calendar-api.service';
import { Util, LSUrlBuilder } from './ls-utils';
import { EventTemporaryDataService } from './event-data.service';
import { Constants } from './constants';

@Component({
  selector: 'ls-ui-event-component',
  templateUrl: 'ls-ui-new-event.component.html',
  providers: [EventTemporaryDataService]
})
export class EventComponent implements OnInit, OnDestroy {

    private routeParam: string;
    private eventForm: FormGroup;
    private event: IItem;
    private instrumentItems: IItems;
    private eventSubscription: Subscription;
    private instrumentSelection: object[] = [];

    constructor(private calendarStore: CalendarStoreService<EventActionSubjectData>,
                public activeModal: NgbActiveModal,
                private calendarApiService: CalendarApiService,
                private formBuilder: FormBuilder,
                private eventDataService: EventTemporaryDataService) {}

    ngOnInit() {
        this.initForm();
        this.setForm();
    }

    get instruments() {
        return this.instrumentItems;
    }

    get eventProperties() {
        return this.event.Properties;
    }

    private initForm() {
        this.eventForm = this.formBuilder.group({
            EventDate: new FormControl(new Date(), Validators.required),
            EndDate: new FormControl(new Date(), Validators.required),
            EventOwner: new FormControl('', Validators.required),
            NeedAssistance: new FormControl('', Validators.required),
            Instrument: new FormControl('', Validators.required)
        });
    };

    private setForm() {
        const resource$ = this.calendarApiService.getView(LSUrlBuilder.getViewUrl('instruments', 'InstrumentsNIAMS'));
        const event$ = this.routeParam ? this.calendarApiService.getItem(LSUrlBuilder.getItemUrl('InstrumentReservations', this.routeParam)) : this.calendarApiService.getNew(LSUrlBuilder.getNewUrl('InstrumentReservations'));
        
        this.eventSubscription = forkJoin([resource$,event$]).subscribe((data)=>{
            this.instrumentItems = data[0].items;
            console.log("instrumentItems", this.instrumentItems);
            this.event = data[1].item;
            console.log("event", this.event);

            this.setInstrumentSelection();
            if(this.routeParam) {
                this.setUpdateView();
            } else {
                this.setCreateView();
            }
            
        });
    }

    private setInstrumentSelection() {
        _.each(this.instruments, (instrument) => {
            this.instrumentSelection.push({Id: instrument.ID, Value: instrument.Title});
        });
    };

    private setCreateView() {
        const formKeys = _.keys(this.eventForm.controls);
        _.each(formKeys, (key) => {
            if(this.eventForm.controls[key] instanceof FormControl) {
                this.eventForm.controls[key].setValue(this.eventDataService[key]);
            }
        });
    };

    private setUpdateView() {
        const formKeys = _.keys(this.eventForm.controls);
        _.each(formKeys, (key) => {
            if(this.eventForm.controls[key] instanceof FormControl) {
                const propertyValue = Util.getValueByKey(key, this.eventProperties);
                this.eventForm.controls[key].setValue(propertyValue);
            }
        });
        // for select, reset
        const instrumentIndex = _.findIndex(this.instrumentSelection, this.eventForm.controls['Instrument'].value);
        this.eventForm.controls[Constants.INSTRUMENT_FIELD_NAME].setValue(this.instrumentSelection[instrumentIndex]);
    };

    private setModel() {
        console.log("setModel");
        const formKeys = _.keys(this.eventForm.controls);
        _.each(formKeys, (key) => {
            if(this.eventForm.controls[key] instanceof FormControl) { 
                Util.setValueByKey(key, this.eventForm.controls[key].value, this.eventProperties);
            }
        });
    }

    saveEvent() {
        this.setModel();
        if(this.routeParam) {
            console.log("for update", this.event);
            this.calendarStore.calendarEventService$.next({type: Constants.EVENT_UPDATE_ACTION, payload: {id: this.routeParam, event: this.event}});
        } else {
            console.log("for create", this.event);
            this.calendarStore.calendarEventService$.next({type: Constants.EVENT_CREATE_ACTION, payload: {id: null, event: this.event}});
        };
        this.activeModal.close();
    }

    deleteEvent() {
        this.calendarStore.calendarEventService$.next({type: Constants.EVENT_DELETE_ACTION, payload: {id: this.routeParam, event: this.event}});
        this.activeModal.close();
    }

    set routerParam(id: string) {
        this.routeParam = id;
    }

    ngOnDestroy() {
        if(this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }
}
