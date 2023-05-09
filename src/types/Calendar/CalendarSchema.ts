import { JSONSchemaType } from 'ajv';

// Default calendar
export interface ICalendar {
  // Unique string code to identify each calendar. 
  // Intended to be used like ISO 3166 country codes.
  code: string;
  // A non-unique name to identify the calendar by, meant to be human-readable
  // and the title of the overview page for each calendar.
  name: string;
  // A string representing the name of the region or regions
  // this calendar is used in.
  region?: string | string[];
  // The time offset from the start of time, to the start of this calendar.
  // Useful when you have multiple calendars which year 0 don't
  // start on the same day, and calculating dates between them.
  // If null, the offset is 0.
  offset?: IOffset;
  // The length of a year/week/day/hour in this calendar.
  'year-length': IYearLength;
  'week-length'?: number; // in number of days
  'day-length'?: number; // in number of hours
  'hour-length'?: number; // in number of minutes
  'minute-length'?: number; // in number of seconds
  // The time, in seconds, that one in-game turn takes, useful to keep track of
  // what happened in combat in RPGs or such.
  'turn-length'?: number;
  // A list over the months in this calendar
  months: IMonth[];
  // A list of named days like hollydays or similar that appear irregularily or
  // not always within a single month, for example like
  // easter in the gregorian calendar
  'named-days': INamedDayYear[];
  // A list of aliases to the code field that are unique across all code and
  // aliases fields, can be used in all the same ways as the code field.
  // Useful to keep backwards compatibility with old pages if the official
  // code for the calendar changes.
  aliases?: string[];
}

// The same as ICalendar, but copies all fields from the calendar which has a
// code or alias field corresponding with the source field on this calendar.
// All fields defined in this interface overwrites the corresponding
// values copied from the source.
export interface ICalendarFromSource {
  // A new unique code is required
  code: string;
  name?: string;
  // A string corresponding with the code or aliases field of a
  // pre-existing calendar.
  source: string;
  region?: string;
  offset?: IOffset;
  'year-length'?: IYearLength;
  'week-length'?: number;
  'day-length'?: number;
  'hour-length'?: number;
  'minute-length'?: number;
  'turn-length'?: number;
  months?: IMonth[];
  aliases?: string[];
}

// Used to keep track of the offset between the start of this calendar and an
// agreed upon start-point in time (can be negative to denote time
// before the start-point).
export interface IOffset {
  year?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

// Used to keep track of the length og a year in days,
// hours, minutes and seconds. If all are null, the offset is 0.
export interface IYearLength {
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

// Definition of a month in the calendar.
export interface IMonth {
  // The name of the month.
  name: string;
  // The length of the month, in days.
  length: number;
  // A list of named days, like hollydays or birthdays that always appear in the same month (but does not have to be the same date each time)
  'named-days'?: INamedDayMonth[];
}

// An extension to IMonth that allows this object to represent
// one or more contiguous days that don't appear every year.
export interface ILeapDays extends IMonth{
  // Should always be true if this object represents leap days.
  'is-leap-days': boolean;
  // If this object represents leapdays, this decides if it's standalone or
  // if it appears as part of another month.
  // Examples are the Gregorian calendar where it appears as the 29th day of
  // February, and the International Fixed Calendar where it apears as its own
  // pseudo-month between June and Sol.
  'is-standalone'?: boolean;
  // Defines where the leap days appear.
  appears?: {
    // The string name of the month it appears in.
    month: string;
    // The day it replaces (if so it pushes all succeeding days back), if left
    // blank it defaults to be the first day after the
    // month is over (eg. 29th of February)
    day?: number;
  };
}

// Used to store named days, like hollidays and such.
export interface INamedDay {
  // A string with the presentation name of the day.
  name: string;
}

export interface INamedDayMonth extends INamedDay {
  // The day in the month this day is on (must be static).
  day?: number;
}

export interface INamedDayYear extends INamedDay {
  // A string formula that is used to calculate the date of the named day.
  formula?: string;
}

export const NamedDaySchema: JSONSchemaType<INamedDayMonth | INamedDayYear> = {
  $id: 'http://obsidian-calendar-manager/shemas/NamedDaySchema.json',
  type: 'object',
  oneOf: [
    {
      properties: {
        name: { type: 'string' },
        position: { type: 'number' },
      },
      required: ['position'],
      not: {required: ['formula']},
    },
    {
      properties: {
        name: { type: 'string' },
        formula: { type: 'string' },
      },
      required: ['formula'],
      not: {required: ['position']},
    },
  ],
  required: ['name']
}

export const OffsetSchema: JSONSchemaType<IOffset> = {
  $id: 'http://obsidian-calendar-manager/shemas/OffsetSchema.json',
  type: 'object',
  properties: {
    year: { type: 'integer', nullable: true },
    day: { type: 'integer', nullable: true },
    hour: { type: 'integer', nullable: true },
    minute: { type: 'integer', nullable: true },
    second: { type: 'integer', nullable: true },
  }
}

export const YearLengthSchema: JSONSchemaType<IYearLength> = {
  $id: 'http://obsidian-calendar-manager/shemas/YearLengthSchema.json',
  type: 'object',

  properties: {
    day: { type: 'integer', nullable: true },
    hour: { type: 'integer', nullable: true },
    minute: { type: 'integer', nullable: true },
    second: { type: 'integer', nullable: true },
  },
  anyOf: [
    {required: ['day']},
    {required: ['hour']},
    {required: ['minute']},
    {required: ['second']}
  ],
}

export const MonthSchema: JSONSchemaType<IMonth> = {
  $id: 'http://obsidian-calendar-manager/shemas/MonthSchema.json',
  type: 'object',
  properties: {
    name: {type: 'string'},
    length: {type: 'integer'},
    'named-days': {
      type: 'array',
      items: {
        type: 'object',
        $ref: 'NamedDaySchema.json',
        required: ['name']
      },
      nullable: true,
    },
  },
};

// export const MonthSchema: JSONSchemaType<IMonth> = {
//   $id: 'http://obsidian-calendar-manager/shemas/MonthSchema.json',
//   type: 'object',
//   properties: {
//     name: { type: 'string' },
//     length: { type: 'number' },
//     'is-leap-days': { type: 'boolean', nullable: true },
//     'is-standalone': { type: 'boolean', nullable: true },
//     'named-days': {
//       type: 'array',
//       items: {
//         type: 'object',
//         $ref: 'NamedDaySchema.json',
//         required: ['name']
//       },
//       nullable: true
//     },
//     appears: {
//       type: 'object',
//       properties: {
//         month: { type: 'string' },
//         day: { type: 'number', nullable: true },
//       },
//       required: ['month'],
//       nullable: true,
//       additionalProperties: true,
//     },
//   },
//   required: ['name', 'length'],
// }

export const CalendarSchema: JSONSchemaType<ICalendar | ICalendarFromSource> = {
  $id: 'http://obsidian-calendar-manager/shemas/CalendarSchema.json',
  type: 'object',
  oneOf: [
    {
      properties: {
        code: { type: 'string' },
        name: { type: 'string' },
        region: { type: 'string', nullable: true },
        offset: { type: 'object', $ref: 'OffsetSchema.json', nullable: true },
        'year-length': { type: 'object', $ref: 'YearLengthSchema.json', nullable: true},
        'week-length': { type: 'integer', nullable: true },
        'day-length': { type: 'integer', nullable: true },
        'hour-length': { type: 'integer', nullable: true },
        'turn-length': { type: 'integer', nullable: true },
        months: {
          type: 'array',
          items: {
            type: 'object',
            $ref: 'MonthSchema.json',
          },
          minItems: 1,
          nullable: true
        },
        aliases: {
          type: 'array',
          items: { type: 'string' },
          nullable: true
        },
      },
    },
  ],
  required: ['code', 'name', 'year-length', 'months']
}

export const CalendarListSchema: JSONSchemaType<ICalendar[]> = {
  $id: 'http://obsidian-calendar-manager/shemas/CalendarListSchema.json',
  type: 'array',
  items: {
    type: 'object',
    $ref: 'CalendarSchema.json',
    required: ['code', 'months', 'name', 'year-length']
  }
}