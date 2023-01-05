import { CustomTag } from "CustomTagEngine/types/CustomTag";
import { replace_custom_tag_in_string } from "./ReplaceCustomTagInString";
import { CustomTagHandler } from "CustomTagEngine/types/CustomTagHandler";

export function replace_all_custom_tags_in_string(str: string, tag: CustomTag, handlers: [CustomTagHandler]): string {
  let data = str;
  let temp_data = replace_custom_tag_in_string(str, tag, handlers);

  if (temp_data === null) {
    return data
  }

  return replace_all_custom_tags_in_string(temp_data, tag, handlers);
}