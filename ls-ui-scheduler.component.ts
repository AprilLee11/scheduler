import { Component, OnInit, ViewChild, AfterViewInit, OnChanges, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalendarOptions, Calendar, EventClickArg } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventComponent } from './ls-ui-new-event.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

import { CalendarStoreService } from './calendar-store.service';
import { filter } from 'rxjs/operators';
import { LsUiFullCalendarComponent } from './ls-ui-full-calendar.component';
import { CalendarData, EventActionSubjectData } from './models';

@Component({
  selector: 'ls-ui-scheduler',
  templateUrl: './ls-ui-scheduler.component.html',
  styles: [require('./ls-ui-scheduler.component.scss').toString()],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SchedulerComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() calendarOption: CalendarOptions;
  @Input() calendarData: CalendarData;
  @Output() refresh: EventEmitter<EventActionSubjectData> = new EventEmitter();

  private calendarOptions: CalendarOptions;
  private calendar: Calendar;
  private calendarSubscription: Subscription;
  @ViewChild('lsuifullcalendar') fullcalendar: LsUiFullCalendarComponent;

  constructor(private calendarStore: CalendarStoreService<EventActionSubjectData>, 
              private modalService: NgbModal) {}

  ngOnInit() {
    this.calendarOptions = _.extend({}, this.calendarOption, {
      plugins: [ dayGridPlugin, timeGridPlugin, resourceTimelinePlugin, listPlugin, interactionPlugin ],
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this)
    });
  };

  ngOnChanges() {
    if(this.calendar && this.calendarData) {
      this.calendar.setOption('events', this.calendarData.events);
      this.calendar.setOption('resources', this.calendarData.resources);
    };
  }

  ngAfterViewInit() {
    this.calendar = this.fullcalendar.getApi();
    this.subscribeCalendar();
  };

  private subscribeCalendar() {
    const eventService$ = this.calendarStore.calendarEventService$.pipe(filter((data: EventActionSubjectData) => data != null));
    this.calendarSubscription = eventService$.subscribe((data) => {
      console.log("data to emit", data);
      this.refresh.emit(data);
    });
  }

  handleDateClick(arg: DateClickArg) {
    const modalRef = this.modalService.open(EventComponent);
  };

  handleEventClick(arg: EventClickArg) {
    const modalRef = this.modalService.open(EventComponent);
    modalRef.componentInstance.routerParam = arg.event.id;
  }

  ngOnDestroy() {
    if(this.calendarSubscription) {
      this.calendarSubscription.unsubscribe();
    }
  };
}
