export class Constants {
    public static readonly DOMAIN: string = 'https://f.ci.aws.labshare.org';
    public static readonly VERSION: string = 'v3';
    public static readonly FACILITY_ID: string = 'rss-ci-instrumentation-spo';
    public static readonly FACILITY: string = 'facility';
    public static readonly LIST: string = 'list';
    public static readonly VIEW: string = 'view';
    public static readonly ITEM: string = 'item';
    public static readonly NEW: string = 'new';
    public static readonly RESOURCE_LIST_NAME: string = 'instruments';
    public static readonly RESOURCE_VIEW_NAME: string = 'InstrumentsNIAMS';
    public static readonly EVENT_LIST_NAME: string = 'InstrumentReservations';
    public static readonly EVENT_VIEW_NAME: string = 'All Events';
    public static readonly EVENT_CREATE_ACTION: string = 'CREATE';
    public static readonly EVENT_UPDATE_ACTION: string = 'UPDATE';
    public static readonly EVENT_DELETE_ACTION: string = 'DELETE';
    public static readonly RESOURCE_FILED_KEYS: string[] = ['ID', 'Instrument', 'Color'];
    public static readonly EVENT_FIELD_KEYS: string[] = ['ID', 'EventDate', 'Color', 'EndDate', 'Instrument', 'EventOwner', 'Title', 'resourceId', 'isSelected', 'allDay'];
    public static readonly INSTRUMENT_FIELD_NAME = 'Instrument';
}  

