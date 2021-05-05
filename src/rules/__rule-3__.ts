import { pipe, flow } from "fp-ts/function";
import { none, some, chain, map, fold, Option } from "fp-ts/Option";
import { maybeSsn, Ssn, foldSsn } from "../model";

const rule3 = maybeSsn;

export default rule3;

const removeHyphenation = (s: string) => s.replace(/-/g, "");

const toInt = (s: string) => {
  const parsed = parseInt(s, 10);
  return isNaN(parsed) ? none : some(parsed);
};

export const toInteger = (maybeSsn: Option<Ssn>) =>
  pipe(maybeSsn, map(foldSsn), chain(flow(foldSsn, toInt)));
