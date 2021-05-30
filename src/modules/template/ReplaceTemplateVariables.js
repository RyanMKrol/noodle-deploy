import * as ejs from "ejs";

export default function replaceTemplateVariables(content, data) {
  return ejs.render(content, data);
}
