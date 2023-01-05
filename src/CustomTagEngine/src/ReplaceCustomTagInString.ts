import { CustomTag } from "CustomTagEngine/types/CustomTag";
import { TagBounds } from "CustomTagEngine/types/TagBounds";
import { CustomTagHandler } from "CustomTagEngine/types/CustomTagHandler";
import { decode_and_replace_content } from "./DecodeAndReplaceContent";

export function replace_custom_tag_in_string(str: string, tag: CustomTag, handlers: [CustomTagHandler]): string | null {
  let tag_bounds: TagBounds = {
    open_marker: {
      begin: -1,
      end: -1
    },
    close_marker: {
      begin: -1,
      end: -1
    }
  };

  tag_bounds.open_marker.begin = str.indexOf(tag.open_marker);
  tag_bounds.close_marker.begin = str.indexOf(tag.close_marker);

  if (tag_bounds.open_marker.begin < 0 || tag_bounds.close_marker.begin < 0) {
    return null;
  }

  tag_bounds.open_marker.end = tag_bounds.open_marker.begin + tag.open_marker_size;
  tag_bounds.close_marker.end = tag_bounds.close_marker.begin + tag.close_marker_size;

  let decoded_and_replaced_str = decode_and_replace_content(str, tag_bounds, handlers);
  if (decoded_and_replaced_str === str) {
    return null
  }

  return decoded_and_replaced_str;
}