import { xml2json } from "xml-js";

import {
  SNACAttributesGroup,
  SNACChild,
  SNACText,
  SNACCDATA,
  SNACComment,
  SNACPI,
  SNACElement,
} from "./types";

type InputElement = {
  type: "element";
  name: string;
  attributes: {
    [name: string]: string;
  };
  elements: InputNode[];
};

type InputAttributes = {
  [name: string]: string;
};

type InputText = {
  type: "text";
  text: string;
};

type InputCDATA = {
  type: "cdata";
  cdata: string;
};

type InputComment = {
  type: "comment";
  comment: string;
};

type InputPI = {
  type: "instruction";
  name: string;
  instruction: string;
};

type InputNode = InputElement | InputText | InputCDATA | InputComment | InputPI;

export const convert = (xmlDataStr: string) => {
  const inputNode:InputNode = JSON.parse(xml2json(xmlDataStr)).elements[0] ;
  return json2snac(inputNode)
};

export const json2snac = (element: InputNode): SNACChild => {
  switch (element.type) {

    case "element":
      return outputElement(element);

    case "text":
      return outputText(element);

    case "cdata":
      return outputCDATA(element);

    case "comment":
      return outputComment(element);

    case "instruction":
      return outputPI(element);

    default:
      return outputBlankText();
  }
};

const outputElement = (element: InputElement): SNACElement => {
  let namespace: string | null, name: string;
  const idx = element.name.indexOf(":");
  if (idx > -1) {
    namespace = element.name.slice(0, idx);
    name = element.name.slice(idx + 1);
  } else {
    namespace = null;
    name = element.name;
  }
  return {
    _: "",
    S: namespace,
    N: name,
    A: outputAtts(element.attributes),
    C: outputKids(element.elements),
    a: false,
    o: true,
    q: false,
  };
};

const outputKids = (elements: InputNode[]): SNACChild[] => {
  const out: SNACChild[] = [];
  let prevType = "X";
  for (const e of elements) {
    const child = json2snac(e);
    if (child) {
      if (e.type !== "text" && prevType !== "text") {
        out.push(outputBlankText());
      }
      out.push(child);
      prevType = e.type;
    }
  }
  if (prevType !== "text") {
    out.push(outputBlankText());
  }
  return out;
};

const outputAtts = (attributes: InputAttributes): SNACAttributesGroup => {
  const out: SNACAttributesGroup = {};

  if (attributes) {
    const keys = Object.keys(attributes);

    for (const key in keys) {
      let namespace: string, name: string;
      const idx = keys[key].indexOf(":");
      if (idx > -1) {
        namespace = keys[key].slice(0, idx);
        name = keys[key].slice(idx + 1);
      } else {
        namespace = "@";
        name = keys[key];
      }
      if (!out[namespace]) {
        out[namespace] = {};
      }
      out[namespace][name] = attributes[keys[key]];
    }
  }
  return out;
};

const outputText = (text: InputText): SNACText => {
  return {
    _: "",
    T: text.text,
    o: true,
    q: false,
  };
};

const outputBlankText = (): SNACText => {
  return {
    _: "",
    T: "BLANK_TEXT",
    o: true,
    q: false,
  };
};

const outputCDATA = (cdata: InputCDATA): SNACCDATA => {
  return {
    _: "",
    D: cdata.cdata,
    o: true,
    q: false,
  };
};

const outputComment = (comment: InputComment): SNACComment => {
  return {
    _: "",
    M: comment.comment,
    o: true,
    q: false,
  };
};

const outputPI = (pi: InputPI): SNACPI => {
  return {
    _: "",
    L: pi.name,
    B: pi.instruction,
    o: true,
    q: false,
  };
};
