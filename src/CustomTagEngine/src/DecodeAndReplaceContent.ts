import { TagBounds } from "CustomTagEngine/types/TagBounds";
import { CustomTagHandler } from "CustomTagEngine/types/CustomTagHandler";

export function decode_and_replace_content(str: string, tag_bounds: TagBounds, handlers: [CustomTagHandler]): string {
  let content = str.slice(tag_bounds.open_marker.end, tag_bounds.close_marker.begin).trim();
  let return_str = str;

  handlers.forEach(handler => {
    if (handler.verifier(content) === true) {
      return_str = str.slice(0, tag_bounds.open_marker.begin) + handler.callback(content) + str.slice(tag_bounds.close_marker.end);
    }
  });

  return return_str;
}