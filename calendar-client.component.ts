import { Component, OnInit, OnDestroy } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { CalendarOptions } from "@fullcalendar/core";
import * as _ from "lodash";

import { LSDataBuilder } from "./ls-data-builder.service";
import { CalendarApiService } from "./calendar-api.service";
// import { ActivatedRoute, Router } from '@angular/router';
import { LSUrlBuilder } from "./ls-utils";
import { Constants } from "./constants";
import { CalendarEvent, CalendarResource, CalendarData } from "./models";
import { Util } from "./ls-utils";

@Component({
  selector: "calendar-client",
  templateUrl: "./calendar-client.component.html"
})
export class CalendarClientComponent implements OnInit, OnDestroy {
  private resourcesData: CalendarResource[];
  private eventsData: CalendarEvent[];
  private calendarData: CalendarData;
  private calendarOption: CalendarOptions;
  private calendarDataSubscription: Subscription;
  private calendarCRUDSubscription: Subscription;
  private tenantId: string;

  constructor(private calendarApiService: CalendarApiService) {}

  ngOnInit() {
    this.setCalendarOption();
    this.setCalendarData();
  }

  private setCalendarOption() {
    this.calendarOption = {
      initialView: "dayGridMonth",
      headerToolbar: {
        start: "prev,today,next listWeek",
        center: "title",
        end: "resourceTimeline timeGridWeek dayGridMonth"
      },
      dayMaxEvents: 3
    };
  }

  private setCalendarData() {
    const resource$ = this.calendarApiService.getView(
      LSUrlBuilder.getViewUrl(
        Constants.RESOURCE_LIST_NAME,
        Constants.RESOURCE_VIEW_NAME
      )
    );
    const event$ = this.calendarApiService.getView(
      LSUrlBuilder.getViewUrl(
        Constants.EVENT_LIST_NAME,
        Constants.EVENT_VIEW_NAME
      )
    );

    this.calendarDataSubscription = forkJoin([resource$, event$]).subscribe(
      data => {
        const resourceKeys = Constants.RESOURCE_FILED_KEYS;
        this.resourcesData = new LSDataBuilder(data[0].items, resourceKeys)
          .createData()
          .changeTypeToNumber(["ID"])
          .changeKey([
            { oldKey: "ID", newKey: "id" },
            { oldKey: "Instrument", newKey: "title" }
          ])
          .sort("title")
          .build();
        const eventItems = this.preprocessEvents(
          data[1].items,
          this.resourcesData
        );
        const eventKeys = Constants.EVENT_FIELD_KEYS;
        this.eventsData = new LSDataBuilder(eventItems, eventKeys)
          .createData()
          .changeTypeToNumber(["ID"])
          .changeTypeToDate(["EventDate", "EndDate"])
          .changeKey([
            { oldKey: "ID", newKey: "id" },
            { oldKey: "EventDate", newKey: "start" },
            { oldKey: "EndDate", newKey: "end" },
            { oldKey: "Title", newKey: "title" },
            { oldKey: "Color", newKey: "color" },
            { oldKey: "EventOwner", newKey: "createdby" }
          ])
          .normalizeByValue(["Instrument", "createdby"])
          .changeValue("title", "concat", ["Instrument", " : ", "createdby"])
          .sort("start")
          .build();
        this.calendarData = {
          resources: this.resourcesData,
          events: this.eventsData
        };
      }
    );
  }

  private preprocessEvents(items, resourceData) {
    const resourceIds: number[] = _.map(resourceData, "id");
    const eventItems: object[] = [];

    _.each(items, item => {
      const instrumentProperty = _.find(item.Properties, {
        internalName: "Instrument"
      });
      // const instrumentId = _.has(instrumentProperty, 'value.Refs[0].Id') ? instrumentProperty.value.Refs[0].Id : undefined;
      const instrumentId = Util.getIdFromProperty(instrumentProperty);

      if (instrumentId && _.includes(resourceIds, instrumentId)) {
        const colorProperty = _.find(item.Properties, {
          internalName: "Color"
        });
        colorProperty.value = _.find(resourceData, { id: instrumentId }).Color;

        item.Properties.push(
          { internalName: "resourceId", value: instrumentId },
          { internalName: "isSelected", value: true },
          { internalName: "allDay", value: false }
        );

        eventItems.push(item);
      }
    });

    return eventItems;
  }

  private handleCRUDRequest(request) {
    console.log("request", request);
    let eventCRUDResponse$;
    switch (request.type) {
      case Constants.EVENT_CREATE_ACTION:
        console.log(
          "createUrl",
          LSUrlBuilder.createUrl(Constants.EVENT_LIST_NAME)
        );
        eventCRUDResponse$ = this.calendarApiService.create(
          LSUrlBuilder.createUrl(Constants.EVENT_LIST_NAME),
          request.payload.event
        );
        break;
      case Constants.EVENT_UPDATE_ACTION:
        eventCRUDResponse$ = this.calendarApiService.update(
          LSUrlBuilder.updateUrl(Constants.EVENT_LIST_NAME, request.payload.id),
          request.payload.event
        );
        break;
      case Constants.EVENT_DELETE_ACTION:
        eventCRUDResponse$ = this.calendarApiService.delete(
          LSUrlBuilder.deleteUrl(Constants.EVENT_LIST_NAME, request.payload.id)
        );
        break;
      default:
        break;
    }
    this.calendarCRUDSubscription = eventCRUDResponse$.subscribe(data => {
      this.setCalendarData();
    });
  }

  ngOnDestroy() {
    if (this.calendarDataSubscription) {
      this.calendarDataSubscription.unsubscribe();
    }
    if (this.calendarCRUDSubscription) {
      this.calendarCRUDSubscription.unsubscribe();
    }
  }
}
