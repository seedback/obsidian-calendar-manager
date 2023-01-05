export class CustomTag {
  name: string;
  open_marker: string;
  close_marker: string;
  open_marker_size: number;
  close_marker_size: number;

  constructor(open_marker: string, close_marker: string, name: string = "") {
    this.open_marker = open_marker;
    this.close_marker = close_marker;
    this.open_marker_size = this.open_marker.length;
    this.close_marker_size = this.close_marker.length;
    this.name = name;
  }
}