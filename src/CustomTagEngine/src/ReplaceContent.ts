import { TagBounds } from "CustomTagEngine/types/TagBounds";

export function replace_content(str: string, replacement_string: string, tag_bounds: TagBounds): string {
  return str.slice(0, tag_bounds.open_marker.begin) + replacement_string + str.slice(tag_bounds.close_marker.end);
}