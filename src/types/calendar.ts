
enum ErrorType {
  MISSING_REQUIRED_PROPERTY,
  MISSING_REQUIRED_PROPERTY_CHOICE,
  CONFLICTING_PROPERTIES,
  OTHER
}

export class Calendar {
  _id: string;
  _name?: string;
  _region?: string;
  _yearLength?: YearLength;
  _yearLengthInSeconds?: number;

  constructor (json:any) {
    if(!json.id){this.handleError(ErrorType.MISSING_REQUIRED_PROPERTY, 'id')}
    this._id = json.id ?? '';

    this.checkForJsonErrors(json);
    
    this._name = json.name ?? '';
    this._region = json.region ?? '';

    this._yearLength = new YearLength;
    this._yearLength.days = json['year length']?.days;
    this._yearLength.hours = json['year length']?.hours;
    this._yearLength.minutes = json['year length']?.minutes;
    this._yearLength.seconds = json['year length']?.seconds;



    console.log(this);
  };

  calculateYearLengthInSeconds() {
    return (this._yearLength?.seconds ?? 1) * (this._yearLength?.minutes ?? 1) * (this._yearLength?.hours ?? 1) * (this._yearLength?.days ?? 1);
  }

  checkForJsonErrors(json:any){
    if(json['year length'] && json['year length in seconds']){
      this.handleError(ErrorType.CONFLICTING_PROPERTIES, '"year length" and "year length in seconds"')
    }
  }

  handleError(errorType:ErrorType, message:string) {
    const id = this._id ?? 'UNKNOWN_ID'
    switch (errorType) {
      case ErrorType.MISSING_REQUIRED_PROPERTY:
        console.error(`In calendar with id ${id}: A ${message} property is required, but not found in yaml/json.`);
        throw new Error(`Calendar Manager - Missing ${message} property`);
      case ErrorType.CONFLICTING_PROPERTIES:
        console.error(`In calendar with id ${id}: Found properties ${message}, these are conflicting, and only one can be used at a time.`);
        throw new Error(`Calendar Manager - Conflicting properties ${message}`);
    
      default:
        console.error(`In calendar with id ${id}: ${message}`);
        throw new Error(`Calendar Manager - ${message}`);
    }
  }
}

export class YearLength {
  _days: number = 365;
  _hours: number = 6;
  _minutes: number = 13;
  _seconds: number = 53;

  public get days () {return this._days}

  public set days (days: number) {if (days) {this._days = days}}
  public set hours (hours: number) {if (hours) {this._hours = hours}}
  public set minutes (minutes: number) {if (minutes) {this._minutes = minutes}}
  public set seconds (seconds: number) {if (seconds) {this._seconds = seconds}}
}