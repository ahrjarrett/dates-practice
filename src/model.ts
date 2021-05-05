import * as t from "io-ts";
import { Newtype, prism } from "newtype-ts";

export interface Ssn extends Newtype<{ readonly Ssn: unique symbol }, string> {}

const regex = /^\d{3}-\d{2}-\d{4}$/i;

export const isSsn = (s: string) => regex.test(s);

const prismSsn = prism<Ssn>(isSsn);

export const maybeSsn = prismSsn.getOption;
export const foldSsn = prismSsn.reverseGet;

// interface SsnBranding {
//   readonly Ssn: unique symbol;
// }

// type SsnBrand = t.Branded<string, SsnBranding>;

// export const Ssn = t.brand(
//   t.string,
//   (s): s is SsnBrand => regex.test(s),
//   "Ssn"
// );

// export type Ssn = t.TypeOf<typeof Ssn>;
