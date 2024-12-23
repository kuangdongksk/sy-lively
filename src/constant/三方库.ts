import $, { Cash } from "cash-dom";
import jshashes from "jshashes";

const MD5 = new jshashes.MD5() as {
  hex: (str: string) => string;
  b64: (str: string) => string; // base64, 一般是这个
};

export { $, Cash, MD5 };
