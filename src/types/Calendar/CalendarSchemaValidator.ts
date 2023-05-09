import AJV from 'ajv';
import * as CS from "./CalendarSchema";

const ajv = new AJV();

const validate_calendar =
  ajv.addSchema(CS.CalendarSchema)
    .addSchema(CS.MonthSchema)
    .addSchema(CS.NamedDaySchema)
    .addSchema(CS.OffsetSchema)
    .addSchema(CS.YearLengthSchema)
    .compile(CS.CalendarListSchema);

export default validate_calendar;
