export type SNACNode = {
  _: string;
  o: boolean;
  q: boolean;
};

export type SNACElement = SNACNode & {
  S: string | null;
  N: string;
  A: SNACAttributesGroup;
  C: SNACChild[];
  a: boolean;
};

export type SNACAttributesGroup = {
  [name: string]: SNACAttributes;
};

export type SNACAttributes = {
  [name: string]: string;
};

export type SNACChild =
  | SNACElement
  | SNACText
  | SNACCDATA
  | SNACComment
  | SNACPI;

export type SNACText = SNACNode & {
  T: string;
};

export type SNACCDATA = SNACNode & {
  D: string;
};

export type SNACComment = SNACNode & {
  M: string;
};

export type SNACPI = SNACNode & {
  L: string;
  B: string;
};
