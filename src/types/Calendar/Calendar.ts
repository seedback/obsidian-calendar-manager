import {
  ICalendar,
  IOffset,
  IYearLength,
  IMonth,
  MonthSchema,
  NamedDaySchema,
  OffsetSchema,
  YearLengthSchema,
  CalendarSchema
} from "./CalendarSchema";
import AJV, { JSONType } from 'ajv'

const ajv = new AJV();


export class Calendar implements ICalendar {
  code: string;
  name: string;
  'based-on'?: boolean;
  region?: string;
  offset?: IOffset;
  'year-length': IYearLength;
  'week-length'?: number;
  'day-length'?: number;
  'hour-length'?: number;
  'turn-length'?: number;
  months: IMonth[];
  aliases?: string[];

  constructor(json: ICalendar) {
    this.code = json.code;
    this.name = json.name;
    this['based-on'] = json['based-on'];
    this.region = json.region;
    this.offset = json.offset;
    this['year-length'] = json['year-length'];
    this['week-length'] = json['week-length'];
    this['day-length'] = json['day-length'];
    this['hour-length'] = json['hour-length'];
    this['turn-length'] = json['turn-length'];
    this.months = json.months;
    this.aliases = json.aliases;
  };
}

export function make_calendars(json: ICalendar[]) {
  const calendar_list: Calendar[] = new Array<Calendar>;
  json.forEach(calendar => {
    if (calendar["based-on"]) {
      if (check_for_valid_base(calendar, calendar_list) === -1) {
        console.error(`This calendar is based on another calendar, this feature is not yet implemented\nThe calendar in question has code ${calendar.code}`)
      }
      else {
        calendar_list.push(new Calendar(calendar));
        console.log('New calendar constructed', calendar_list[calendar_list.length - 1]);
      }
    }
  });
}

// export const calendar_from_json = (json: JSON) : Calendar => {
//   if
// }

// function construct_from_source(json: ICalendar, source: Calendar) {
//   const calendar = new Calendar(source);
//   const key_list = ["based-on",
//     'region',
//     'offset',
//     'year-length',
//     'week-length',
//     'day-length',
//     'hour-length',
//     'turn-length',
//     'months',
//     'aliases'];

//   key_list.forEach((key:
//     'based-on' |
//     'region' |
//     'offset' |
//     'year-length' |
//     'week-length' |
//     'day-length' |
//     'hour-length' |
//     'turn-length' |
//     'months' |
//     'aliases') => {
//     if (calendar[key]) {
//       calendar[key] = json[key] as string | number | boolean | IOffset | IMonth[] | string[] | IYearLength;
//     }
//   });
// }

function check_for_valid_base(json: ICalendar, calendar_list: Calendar[]): number {
  calendar_list.forEach((calendar, index) => {
    if (calendar.code === json.code) {
      return index
    }
  });
  return -1;
}
