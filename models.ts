export interface CalendarEvent {
    id?: string;
    title?: string;
    start?: Date;
    end?: Date;
    allDay?: boolean;
    Instrument?: string;
    createdby?: string;
    resourceId?: number;
    color?: string;
    isSelected?: boolean;
}

export interface CalendarResource {
    id?: number;
    title?: string;
    Color?: string;
}

export interface CalendarData {
    events?: CalendarEvent[];
    resources?: CalendarResource[];
}

// export interface LSItems {
//     items?: LSItem[];
// }

// export interface LSItem {
//     item: { ID?: number; Properties? : Property[]; Title?: string }
// }

export interface Property {
    internalName?: string;
    type?: string;
    value?: string | PropertyValueObject;
    label?: string;
    isRequired?: boolean;
}

// interface PropertyValueObject {
//     value: { 
//         Refs[]
//     }
// }

interface Refs {
    Id: string;
    Value: string;
}

export interface ChangeKeyInput {
    oldKey: string;
    newKey: string;
}

export interface EventActionSubjectData {
    type: string;
    payload: object;
}